const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

// 环境变量配置
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 缓存配置函数
function getCacheControl(extname) {
    // JS/CSS/图片缓存 1 年(不常变)
    if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'].includes(extname)) {
        return 'public, max-age=31536000, immutable';
    }
    // HTML 缓存 5 分钟(经常更新)
    if (extname === '.html') {
        return 'public, max-age=300, must-revalidate';
    }
    // JSON 缓存 1 小时
    if (extname === '.json') {
        return 'public, max-age=3600';
    }
    // 默认缓存 1 小时
    return 'public, max-age=3600';
}

// 生成 ETag
function generateETag(content) {
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 27);
}

const server = http.createServer(async (req, res) => {
    // 移除 URL 中的查询参数
    const url = req.url.split('?')[0];
    
    // 处理 API 路由
    if (url === '/api/ave-price') {
        try {
            const aveApiHandler = require('./api/ave-price.js');
            
            // 创建兼容 Vercel 格式的 res 对象
            const mockRes = {
                statusCode: 200,
                headers: {},
                setHeader(key, value) {
                    this.headers[key] = value;
                },
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    res.writeHead(this.statusCode, { ...this.headers, 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                },
                end() {
                    res.writeHead(this.statusCode, this.headers);
                    res.end();
                }
            };
            
            await aveApiHandler(req, mockRes);
            return;
        } catch (error) {
            console.error('API route error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
            return;
        }
    }
    
    // 默认访问 index.html
    let filePath = url === '/' ? '/index.html' : url;
    filePath = path.join(__dirname, filePath);

    // 获取文件扩展名
    const extname = path.extname(filePath).toLowerCase();
    
    // MIME 类型映射
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // 读取并返回文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 页面未找到</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('服务器错误: ' + error.code);
            }
        } else {
            // 生成 ETag
            const etag = generateETag(content);
            
            // 添加 CORS 头部、安全头部和缓存头部
            const headers = {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Cache-Control': getCacheControl(extname),
                'ETag': `"${etag}"`
            };
            
            // 检查客户端缓存
            const clientETag = req.headers['if-none-match'];
            if (clientETag === `"${etag}"`) {
                res.writeHead(304, headers);
                res.end();
                return;
            }
            
            // Gzip 压缩(仅压缩文本文件)
            const shouldCompress = /\.(html|css|js|json|svg)$/.test(filePath);
            const acceptEncoding = req.headers['accept-encoding'] || '';
            
            if (shouldCompress && acceptEncoding.includes('gzip')) {
                headers['Content-Encoding'] = 'gzip';
                const compressed = zlib.gzipSync(content);
                res.writeHead(200, headers);
                res.end(compressed);
            } else {
                res.writeHead(200, headers);
                res.end(content, 'utf-8');
            }
        }
    });
});

server.listen(PORT, () => {
    if (NODE_ENV === 'development') {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 Debear Party 测试服务器已启动');
        console.log('='.repeat(60));
        console.log(`\n📍 本地访问: http://localhost:${PORT}`);
        console.log(`📍 局域网访问: http://192.168.x.x:${PORT}`);
        console.log('\n💡 提示:');
        console.log('   - 确保已安装 MetaMask 或 OKX Wallet');
        console.log('   - 确保钱包已连接到 Berachain 主网 (Chain ID: 80094)');
        console.log('   - 按 Ctrl+C 停止服务器');
        console.log('\n' + '='.repeat(60) + '\n');
    } else {
        console.log(`🚀 Debear Party server started on port ${PORT}`);
        console.log(`📍 Environment: ${NODE_ENV}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
    }
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
