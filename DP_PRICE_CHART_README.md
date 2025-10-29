# DP Token 实时价格图表集成

## 概述
已成功在 `swap.html` 中集成 DP 代币的实时价格图表功能，使用 Ave Cloud Data API 获取价格数据。

## 功能特性

### ✨ 主要功能
- 📊 **实时价格图表**: 使用 Chart.js 显示 DP 价格走势
- 🔄 **自动更新**: 每 15 秒自动刷新价格数据
- 📈 **价格统计**: 显示当前价格、24小时涨跌、市值、交易量、TVL
- 🎨 **精美 UI**: 与现有 Swap 页面风格一致的赛博朋克设计
- 💾 **智能缓存**: 10 秒缓存机制，减少 API 调用

### 📊 显示的数据指标
1. **Current Price** - 当前 DP 价格 (USD)
2. **24h Change** - 24小时价格变化百分比 (绿色为涨/红色为跌)
3. **Market Cap** - 市值
4. **24h Volume** - 24小时交易量
5. **TVL** - 总锁定价值

## 文件结构

```
newdp/
├── swap.html              # Swap 页面 (已集成价格图表)
├── ave-api.js            # Ave Cloud API 集成模块
├── price-chart.js        # 价格图表组件
├── kodiak-api.js         # Kodiak DEX API (原有)
└── swap.js               # Swap 逻辑 (原有)
```

## 配置信息

### ✅ 已配置项
- **API Key**: `7h7NW15y2nApmvp4iyKZ6Ql6HSCPe3irICJKtMK0vKbbYDvohfsyTgwZ55t2QfNL`
- **DP Token Address**: `0xf7c464c7832e59855aa245ecc7677f54b3460e7d`
- **Chain**: Berachain
- **Token ID**: `0xf7c464c7832e59855aa245ecc7677f54b3460e7d-berachain`

## 使用方法

### 1. 直接使用
只需在浏览器中打开 `swap.html`，价格图表会自动加载并开始更新。

### 2. 本地测试
```bash
# 使用简单的 HTTP 服务器
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server

# 然后访问
http://localhost:8000/swap.html
```

## API 模块说明

### ave-api.js
**核心方法**:
- `getDPPrice()` - 获取 DP 当前价格和统计数据
- `getDPDetails()` - 获取 DP 详细信息
- `searchToken()` - 搜索代币
- `formatPrice()` - 格式化价格显示
- `formatLargeNumber()` - 格式化大数字 (K, M, B)

### price-chart.js
**核心功能**:
- 创建和管理 Chart.js 图表
- 自动更新价格数据
- 维护价格历史记录 (最多 20 个数据点)
- 更新 UI 显示

## 自定义配置

### 修改更新频率
在 `price-chart.js` 中:
```javascript
this.updateInterval = 15000; // 15秒 (可修改为其他值)
```

### 修改历史数据点数量
在 `price-chart.js` 中:
```javascript
this.maxDataPoints = 20; // 保留最近 20 个数据点
```

### 修改缓存时间
在 `ave-api.js` 中:
```javascript
cacheDuration: 10000 // 10秒缓存 (可修改)
```

## API 使用限制

根据 Ave Cloud Data API 文档:
- **免费配额**: 需在 https://cloud.ave.ai/register 注册
- **Token Price endpoint**: 消耗 100 CU (Credit Units)
- 建议实现适当的缓存和频率限制

## 故障排除

### 问题: 图表不显示
**解决方案**:
1. 检查浏览器控制台是否有错误
2. 确认 API Key 有效
3. 检查网络连接
4. 验证 DP 代币地址是否正确

### 问题: 价格不更新
**解决方案**:
1. 检查 API 配额是否用尽
2. 查看浏览器控制台的网络请求
3. 验证 token ID 格式: `{address}-{chain}`

### 问题: 显示 "请配置 Ave API Key"
**解决方案**:
- 在 `swap.html` 中确认已正确设置 API Key

## 技术栈

- **Chart.js 4.4.0**: 图表可视化
- **Ave Cloud Data API**: 实时价格数据
- **Vanilla JavaScript**: 无额外框架依赖
- **ethers.js 5.7.2**: Web3 交互 (原有)

## 界面预览

价格图表卡片包含:
```
┌─────────────────────────────────────┐
│  🐻 DP Token Price                  │
├─────────────────────────────────────┤
│  Current: $X.XXXX    24h: +X.XX%   │
│  MCap: $XXM  Vol: $XXK  TVL: $XXK  │
├─────────────────────────────────────┤
│                                     │
│        [价格走势图表]                │
│                                     │
├─────────────────────────────────────┤
│  Updated: HH:MM | Ave Cloud Data   │
└─────────────────────────────────────┘
```

## 相关链接

- **Ave Cloud Data API**: https://ave-cloud.gitbook.io/data-api
- **Chart.js 文档**: https://www.chartjs.org/docs/
- **Berachain**: https://berachain.com

## 注意事项

⚠️ **重要提示**:
1. 请勿在客户端代码中暴露敏感的 API Key
2. 建议通过后端服务器代理 API 请求
3. 监控 API 使用量，避免超出配额
4. 定期更新 DP 代币地址信息

## 更新日志

### 2025-10-29
- ✅ 集成 Ave Cloud Data API
- ✅ 创建实时价格图表组件
- ✅ 添加价格统计信息显示
- ✅ 配置 DP 代币信息
- ✅ 实现自动更新机制

## 技术支持

如遇到问题，请检查:
1. Ave Cloud API 状态
2. Berachain 网络状态
3. DP 代币合约是否正常
