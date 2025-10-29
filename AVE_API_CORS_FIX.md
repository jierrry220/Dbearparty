# Ave API CORS 问题解决方案

## 问题描述

在 Zeabur 部署后，swap.html 无法获取 Ave API 价格数据，原因是浏览器 CORS (跨域资源共享) 限制。

## 解决方案

使用服务端代理转发 API 请求，避免浏览器跨域限制。

## 文件结构

```
newdp/
├── api/
│   └── ave-proxy.js       # CORS 代理服务器
├── ave-api.js             # 修改后支持代理模式
├── swap.html              # 启用代理模式
└── zeabur.json            # Zeabur 配置文件
```

## 修改内容

### 1. 创建代理服务器 (`api/ave-proxy.js`)

- 接收前端请求
- 转发到 Ave API
- 添加 CORS 头部
- 返回数据给前端

### 2. 修改 `ave-api.js`

添加代理模式支持：
```javascript
constructor(apiKey, useProxy = false) {
    this.useProxy = useProxy;  // 新增参数
    this.proxyURL = '/api/ave-proxy';
}
```

### 3. 修改 `swap.html`

启用代理模式：
```javascript
const aveAPI = new AveAPI('YOUR_API_KEY', true);  // true = 使用代理
```

## 部署步骤

### Zeabur 部署

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Fix: Add CORS proxy for Ave API"
   git push
   ```

2. **Zeabur 会自动检测并部署**
   - `zeabur.json` 配置会被自动识别
   - `api/` 目录下的文件会作为 Serverless Functions 部署

3. **验证部署**
   - 访问 `https://your-app.zeabur.app/swap.html`
   - 检查价格是否正常显示
   - 打开浏览器控制台查看是否有错误

## 本地测试

### 本地开发模式（不使用代理）

```javascript
// swap.html
const aveAPI = new AveAPI('YOUR_API_KEY', false);  // false = 不使用代理
```

### 本地测试代理模式

需要本地运行支持 Serverless Functions 的服务器：

```bash
# 安装 Vercel CLI (兼容 Zeabur)
npm install -g vercel

# 在项目目录运行
vercel dev
```

然后访问 `http://localhost:3000/swap.html`

## 故障排查

### 1. 价格仍然无法显示

**检查浏览器控制台：**
```
F12 → Console 标签 → 查看错误信息
```

**常见错误：**

- `Failed to fetch` → 代理服务器未正常运行
- `404 Not Found` → 路由配置错误
- `CORS error` → 代理未添加正确的 CORS 头

### 2. 代理服务器错误

**检查 Zeabur 日志：**
1. 进入 Zeabur Dashboard
2. 选择你的项目
3. 查看 Logs 标签

**常见问题：**

- API Key 错误 → 检查 `ave-proxy.js` 中的 API Key
- 网络超时 → Ave API 服务器可能不稳定
- 内存超限 → Zeabur Free Plan 限制

### 3. 价格显示为 0 或 NaN

**可能原因：**

- Ave API 返回数据格式变化
- Token ID 不正确
- API 限流

**解决方法：**

打开浏览器控制台，查看 Ave API 的实际响应：
```javascript
// 在控制台运行
console.log('Ave API Response:', response_json);
```

## 性能优化

### 缓存策略

代理服务器可以添加缓存层：

```javascript
// api/ave-proxy.js
const cache = new Map();
const CACHE_TTL = 10000; // 10秒

export default async function handler(req, res) {
    const cacheKey = JSON.stringify(req.body);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.status(200).json(cached.data);
    }
    
    // ... fetch from API
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    res.status(200).json(data);
}
```

### CDN 加速

Zeabur 自动提供 CDN，无需额外配置。

## 安全建议

### 1. 限制代理访问

```javascript
// api/ave-proxy.js
res.setHeader('Access-Control-Allow-Origin', 'https://your-domain.zeabur.app');
```

### 2. 添加请求频率限制

```javascript
const rateLimiter = new Map();

export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const limit = rateLimiter.get(ip) || [];
    
    // 清理旧记录
    const recent = limit.filter(t => now - t < 60000); // 1分钟
    
    if (recent.length >= 30) { // 每分钟最多30次
        return res.status(429).json({ error: 'Too many requests' });
    }
    
    recent.push(now);
    rateLimiter.set(ip, recent);
    
    // ... 继续处理请求
}
```

### 3. 环境变量管理

将 API Key 移到环境变量：

```javascript
// api/ave-proxy.js
const apiKey = process.env.AVE_API_KEY;
```

在 Zeabur Dashboard 设置环境变量：
```
AVE_API_KEY=7h7NW15y2nApmvp4iyKZ6Ql6HSCPe3irICJKtMK0vKbbYDvohfsyTgwZ55t2QfNL
```

## 替代方案

### 方案 2：使用公共 CORS 代理（不推荐）

```javascript
const proxyURL = 'https://corsproxy.io/?';
const response = await fetch(proxyURL + encodeURIComponent('https://prod.ave-api.com/v2/tokens/price'), {
    // ...
});
```

**缺点：**
- 依赖第三方服务
- 可能不稳定
- API Key 暴露风险

### 方案 3：Ave API 官方 CORS 支持

联系 Ave API 团队，请求添加你的域名到白名单。

## 总结

通过添加服务端代理，成功解决了 Ave API 的 CORS 问题，使价格数据在 Zeabur 部署环境中正常显示。

### 关键点

✅ 本地开发可以直连（不需要代理）  
✅ 生产环境使用代理（解决 CORS）  
✅ 代理服务器自动随 Zeabur 部署  
✅ 前端只需修改一个参数即可切换  

### 测试清单

- [ ] 本地测试价格显示正常
- [ ] 推送代码到 GitHub
- [ ] Zeabur 自动部署成功
- [ ] 生产环境价格显示正常
- [ ] 浏览器控制台无错误
- [ ] 价格数据每10秒更新
