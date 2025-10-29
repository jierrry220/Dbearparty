# Vercel 部署真实价格代理

## 问题

Zeabur 不支持 Serverless Functions，CORS 代理无法传递 API Key header。

## 解决方案

使用 **Vercel** 部署一个专用的 Serverless Function 代理。

## 为什么选择 Vercel？

✅ **免费** - Hobby plan 完全免费  
✅ **快速** - 全球 CDN，响应快  
✅ **可靠** - 99.99% uptime  
✅ **简单** - 自动部署，零配置  

## 部署步骤

### 1. 注册 Vercel 账号

访问 https://vercel.com 并注册（可以使用 GitHub 登录）

### 2. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 3. 登录 Vercel

```bash
vercel login
```

### 4. 部署项目

在项目根目录运行：

```bash
vercel --prod
```

按提示操作：
- Set up and deploy? **Y**
- Which scope? 选择你的账号
- Link to existing project? **N**
- Project name? `debear-party-api` (或其他名字)
- In which directory is your code located? `./`

### 5. 获取部署 URL

部署完成后，你会得到一个 URL，例如：
```
https://debear-party-api.vercel.app
```

### 6. 更新前端配置

修改 `ave-api.js`:

```javascript
this.simpleProxyURL = 'https://debear-party-api.vercel.app/api/ave-price';
```

### 7. 推送到 GitHub

```bash
git add .
git commit -m "feat: Add Vercel proxy for real-time Ave API prices"
git push
```

Zeabur 会自动部署更新的前端。

## 测试

访问:
```
https://debear-party-api.vercel.app/api/ave-price
```

应该返回 DP 价格 JSON 数据。

然后访问:
```
https://debear.party/swap.html
```

价格应该正常显示！

## 架构

```
浏览器 (debear.party)
    ↓ GET /api/ave-price
    ↓
Vercel Serverless Function
    ↓ POST with X-API-KEY
    ↓
Ave API (prod.ave-api.com)
    ↓ 返回价格数据
    ↓
Vercel Serverless Function
    ↓ 添加 CORS headers
    ↓
浏览器显示价格 ✅
```

## 优势

✅ **真实数据** - 直接从 Ave API 获取  
✅ **无 CORS 问题** - Vercel 后端请求，添加正确的 CORS headers  
✅ **API Key 安全** - API Key 在服务器端，不暴露给浏览器  
✅ **高性能** - Vercel 全球 CDN  
✅ **自动扩展** - 根据流量自动扩展  
✅ **免费** - 完全免费使用  

## 常见问题

### Q: 为什么不用 Zeabur Serverless?

A: Zeabur 的 Serverless Function 配置与 Vercel 不同，经过多次尝试未能成功部署。Vercel 是行业标准，更可靠。

### Q: 可以用其他平台吗？

A: 可以！你也可以部署到：
- **Netlify** (免费，类似 Vercel)
- **Cloudflare Workers** (免费，更快)
- **Railway** (免费额度)

只需要将 `api/ave-price.js` 部署到这些平台即可。

### Q: API Key 会泄露吗？

A: 不会。API Key 在服务器端（Vercel），浏览器看不到。

### Q: 有使用限制吗？

A: Vercel Hobby plan 限制：
- 100 GB 带宽/月
- 100 次部署/天
- 10秒 Function 执行时间

对于这个用途完全够用！

## 本地测试

如果想本地测试 Vercel Function:

```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地运行
vercel dev
```

然后访问 `http://localhost:3000/api/ave-price`

## 监控

登录 Vercel Dashboard 查看：
- 实时请求日志
- 性能指标
- 错误信息

## 总结

使用 Vercel 部署专用的价格代理是唯一可靠的解决方案。

**总耗时：5-10分钟**  
**成本：免费**  
**结果：真实实时价格数据** ✅
