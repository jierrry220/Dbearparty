# 国际化修复清单

## 问题描述
部分页面的提示消息使用了硬编码中文,需要统一使用 i18n 国际化系统。

## 需要修复的文件

### 1. swap.js (19处中文)

| 行号 | 当前中文 | 应改为 | 说明 |
|-----|---------|--------|------|
| 111 | 无法连接到 Berachain 网络，请稍后再试 | 使用 i18n | RPC 连接失败 |
| 205 | 获取报价失败:  | Failed to get quote:  | 报价错误 |
| 279 | 请先连接钱包 | Please connect wallet first | MAX 按钮 |
| 397 | 请输入有效的代币地址 | Please enter valid token address | 自定义代币 |
| 414 | 正在获取代币信息... | Fetching token info... | 加载提示 |
| 454 | 代币 XX 添加成功！ | Token XX added successfully! | 成功提示 |
| 458 | 无法获取代币信息，请检查地址是否正确 | Unable to fetch token info | 错误提示 |
| 469 | 请先连接钱包 | Please connect wallet first | Swap 执行 |
| 478 | 请输入交换数量 | Please enter swap amount | 输入验证 |
| 489 | 检查授权... | Checking approval... | 授权步骤 |
| 494 | 交换中... | Swapping... | 交换中 |
| 498 | 交换成功! 查看交易 | Swap successful! View transaction | 成功消息 |
| 511 | 用户取消交易 | User cancelled transaction | 取消 |
| 513 | 余额不足以支付交易和Gas费用 | Insufficient balance for tx and gas | 余额不足 |
| 515 | 滑点过高,请尝试增加滑点容忍度 | Slippage too high | 滑点 |
| 555 | 请授权代币使用... | Approving token... | 授权中 |
| 562 | 等待授权确认... | Waiting for approval... | 等待 |
| 564 | 代币授权成功! | Token approved! | 授权成功 |
| 548 | 无法获取路由地址 | Unable to get router address | 路由错误 |
| 573 | 正在获取最优路由... | Getting best route... | 路由 |
| 594 | 正在执行交换... | Executing swap... | 执行 |
| 598 | 等待交易确认... | Waiting for confirmation... | 确认 |
| 667 | 请安装 MetaMask 或 OKX Wallet | Please install MetaMask or OKX Wallet | 无钱包 |
| 726 | 钱包连接成功 | Wallet connected successfully! | 连接成功 |
| 735 | 连接失败:  | Connection failed:  | 连接失败 |

### 2. pass-nft.html (约15处中文)

需要检查以下消息:
- 连接钱包相关提示
- 购买 Pass 提示
- 初始化挖矿提示
- 领取奖励提示
- 发送 NFT 提示

### 3. index.html / gamefi.html

检查 common.js 中的 `connectWallet()` 函数是否已国际化。

## 修复方案

### 方案 1: 添加翻译键到 i18n.js

```javascript
// 在 i18n.js 的 en 部分添加:
'wallet.noProvider': 'Please install MetaMask or OKX Wallet!',
'wallet.connecting': 'Connecting wallet...',
'wallet.connected': 'Wallet connected successfully!',
'wallet.failed': 'Connection failed: ',
'wallet.pleaseConnect': 'Please connect wallet first',

'swap.msg.networkError': 'Unable to connect to Berachain network',
'swap.msg.quoteFailed': 'Failed to get quote: ',
'swap.msg.enterAmount': 'Please enter swap amount',
'swap.msg.checking': 'Checking approval...',
'swap.msg.swapping': 'Swapping...',
'swap.msg.success': 'Swap successful!',
'swap.msg.viewTx': 'View transaction',
'swap.msg.cancelled': 'User cancelled transaction',
'swap.msg.insufficientBalance': 'Insufficient balance for transaction and gas',
'swap.msg.slippageTooHigh': 'Slippage too high, try increasing tolerance',
'swap.msg.approving': 'Approving token...',
'swap.msg.waitingApproval': 'Waiting for approval...',
'swap.msg.approved': 'Token approved successfully!',
'swap.msg.routerError': 'Unable to get router address',
'swap.msg.gettingRoute': 'Getting best route...',
'swap.msg.executing': 'Executing swap...',
'swap.msg.waitingConfirm': 'Waiting for confirmation...',
'swap.msg.invalidAddress': 'Please enter valid token address',
'swap.msg.fetchingToken': 'Fetching token info...',
'swap.msg.tokenAdded': 'Token added successfully!',
'swap.msg.tokenFetchFailed': 'Unable to fetch token info, please check address',

// 中文部分也添加对应翻译
```

### 方案 2: 创建辅助函数

```javascript
// 在 swap.js 开头添加:
function t(key) {
    return window.i18n?.translate(key) || key;
}

// 然后替换所有硬编码中文:
this.showMessage(t('swap.msg.pleaseConnect'), 'error');
```

### 方案 3: 使用 common.js 中的 showToast

检查 `common.js` 是否有已经国际化的 `showToast()` 函数,如果有,直接使用。

## 快速修复脚本

创建一个查找替换脚本:

```powershell
# swap.js 修复
$replacements = @{
    "无法连接到 Berachain 网络，请稍后再试" = "Unable to connect to Berachain network"
    "请先连接钱包" = "Please connect wallet first"
    "请输入有效的代币地址" = "Please enter valid token address"
    "正在获取代币信息..." = "Fetching token info..."
    "添加成功！" = "added successfully!"
    "无法获取代币信息，请检查地址是否正确" = "Unable to fetch token info"
    "请输入交换数量" = "Please enter swap amount"
    "检查授权..." = "Checking approval..."
    "交换中..." = "Swapping..."
    "交换成功!" = "Swap successful!"
    "查看交易" = "View transaction"
    "用户取消交易" = "User cancelled transaction"
    "余额不足以支付交易和Gas费用" = "Insufficient balance for transaction and gas"
    "滑点过高,请尝试增加滑点容忍度" = "Slippage too high, try increasing tolerance"
    "请授权代币使用..." = "Approving token..."
    "等待授权确认..." = "Waiting for approval..."
    "代币授权成功!" = "Token approved successfully!"
    "无法获取路由地址" = "Unable to get router address"
    "正在获取最优路由..." = "Getting best route..."
    "正在执行交换..." = "Executing swap..."
    "等待交易确认..." = "Waiting for confirmation..."
    "请安装 MetaMask 或 OKX Wallet" = "Please install MetaMask or OKX Wallet"
    "钱包连接成功" = "Wallet connected successfully!"
    "连接失败: " = "Connection failed: "
}
```

## 优先级

1. **高优先级** - swap.js (用户最常见)
2. **中优先级** - pass-nft.html 
3. **低优先级** - 其他提示

## 验证方法

1. 切换到英文语言
2. 测试连接钱包
3. 测试 Swap 功能
4. 测试 Pass NFT 购买
5. 检查所有错误提示
6. 确认无中文硬编码

## 注意事项

- 保持错误消息的专业性
- 确保中英文语义一致
- 测试所有边界情况
- 更新文档说明

## 时间估算

- swap.js 修复: 30 分钟
- pass-nft.html 修复: 30 分钟
- 测试验证: 20 分钟
- **总计**: 约 1.5 小时
