# Ave API CORS 修复进度

## 问题描述
Swap 页面在 Zeabur 生产环境无法获取 DP 价格，报错：
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

## 修复方案

### 1. ✅ 已完成
- [x] 修复 `server.js` 处理 URL 查询参数（`?v=2`）
- [x] 修改 `ave-api.js` 自动检测环境，生产环境使用代理
- [x] 修复 `ave-api.js` 语法错误（缺少闭合大括号）
- [x] 更新 `swap.html` 版本号至 `v=3` 强制缓存刷新
- [x] 添加 `server.js` 的 serverless function 兼容层

### 2. ⏳ 待完成
- [ ] 推送最新代码到 GitHub（等待网络恢复）
- [ ] 确认 Zeabur 环境变量 `AVE_API_KEY` 已配置
- [ ] 测试生产环境价格功能

## 技术实现

### 环境检测逻辑
```javascript
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

if (isProduction) {
    // 使用 /api/ave-price 代理
    response = await fetch('/api/ave-price', { method: 'GET' });
} else {
    // 直接调用 Ave API
    response = await fetch('https://prod.ave-api.com/v2/tokens/price', { ... });
}
```

### Serverless 兼容层
```javascript
const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(data) { res.writeHead(this.statusCode, { ...this.headers, 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); },
    end() { res.writeHead(this.statusCode, this.headers); res.end(); }
};
```

## 配置检查清单

### Zeabur 环境变量
```
AVE_API_KEY=7h7NW15y2nApmvp4iyKZ6Ql6HSCPe3irICJKtMK0vKbbYDvohfsyTgwZ55t2QfNL
```

### 文件修改
1. `ave-api.js` - 环境检测 + 语法修复
2. `server.js` - 查询参数处理 + API 路由 + serverless 兼容
3. `swap.html` - 版本号更新 v2 → v3

## 下一步操作

1. **等待网络恢复后执行：**
   ```bash
   git push origin master
   ```

2. **验证 Zeabur 配置：**
   - 确认环境变量 `AVE_API_KEY` 存在
   - 检查部署日志是否有错误

3. **测试：**
   - 访问 https://debear.party/swap.html
   - 打开开发者工具查看控制台
   - 应该看到：`Fetching price via proxy` → 成功返回价格数据

## 当前 Git 状态
```
Commit: 3a46dab
Message: fix: add serverless function compatibility layer for ave-price API
Status: 已提交，未推送
```

## 故障排查

如果部署后仍失败：

1. **检查 Zeabur 日志**
   - 查看服务器端错误信息
   - 确认 `AVE_API_KEY` 是否正确读取

2. **测试 API 端点**
   ```bash
   curl https://debear.party/api/ave-price
   ```
   应该返回 DP 价格数据

3. **检查 Ave API 限制**
   - API Key 是否有效
   - 是否超过请求限制

---

**更新时间：** 2025-10-30 19:57 (UTC+8)
**状态：** 等待网络恢复以推送代码
