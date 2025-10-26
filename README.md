# Debear Party - Web3 DeFi 平台

🐻 基于 Berachain 主网的 DeFi + NFT + GameFi 综合平台

## 📋 功能模块

- **Swap**: Kodiak DEX 代币交换
- **Pass NFT**: NFT Pass 购买与挖矿
- **T-Engine**: 代币质押挖矿
- **GameFi**: 游戏化金融（敬请期待）

## 🚀 部署到 Zeabur

### 准备工作

1. 确保所有敏感信息已从代码中移除
2. 检查 `.gitignore` 文件配置正确
3. 确保 `admin.html` 等管理页面不在项目中

### 部署步骤

1. **推送到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **在 Zeabur 创建项目**
   - 访问 [Zeabur](https://zeabur.com)
   - 连接你的 GitHub 仓库
   - 选择本项目

3. **环境变量配置**
   
   Zeabur 会自动检测 `server.js` 并运行，需要配置以下环境变量：
   
   - `PORT`: 端口号（Zeabur 会自动设置）
   - `NODE_ENV`: 设置为 `production`

4. **部署完成**
   
   Zeabur 会自动：
   - 安装依赖 (`npm install`)
   - 启动服务 (`npm start`)
   - 分配域名

## 🔒 安全提示

### ⚠️ 已移除的敏感内容

以下内容已从代码中移除，确保安全：

- ✅ `admin.html` - 合约管理后台（可以控制合约参数、转账等）
- ✅ 个人钱包地址 - 从配置文件中移除
- ✅ 默认邀请人地址 - 改为零地址

### 🛡️ 不要上传的文件

`.gitignore` 已配置排除以下文件：

- `node_modules/` - 依赖包
- `.env` - 环境变量文件
- `contracts/`, `scripts/`, `test/` - 合约和部署脚本
- `admin*.html` - 管理后台页面
- `*.key`, `*.pem`, `*.secret` - 密钥文件

### 📌 部署前检查清单

- [ ] 确认 `admin.html` 已删除
- [ ] 确认代码中无私钥、助记词
- [ ] 确认 `.gitignore` 配置正确
- [ ] 确认 `node_modules` 未提交
- [ ] 测试本地运行 `npm start`

## 🏗️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 访问
http://localhost:3000
```

## 📦 项目结构

```
newdp/
├── index.html          # 首页
├── swap.html           # Swap 页面
├── pass-nft.html       # Pass NFT 页面
├── t-engine.html       # T-Engine 页面
├── gamefi.html         # GameFi 页面
├── server.js           # Node.js 服务器
├── package.json        # 项目配置
├── js/                 # JavaScript 文件
│   ├── common.js       # 公共函数
│   └── i18n.js         # 国际化
├── kodiak-api.js       # Kodiak DEX API
├── swap.js             # Swap 逻辑
└── .gitignore          # Git 忽略文件
```

## 🌐 合约地址（Berachain 主网）

项目使用以下已部署的智能合约：

- DPToken: `0xf7C464c7832e59855aa245Ecc7677f54B3460e7d`
- DebearPass NFT: `0x29f2a6756E5B79C36Eb6699220CB56f7749C7514`
- Pass Sale: `0x40477c0B232cF7AaF939EC79d2Cad51669E101C6`
- NFT Mining: `0x8883Ef27fFa001fAcc323E566Bce387A63Af5B4A`
- T-Engine: `0xd9661D56659B80A875E42A51955434A0818581D8`

## 🔗 相关链接

- Berachain 主网: https://berachain.com
- Berascan 浏览器: https://berascan.com
- Kodiak Finance: https://kodiak.finance

## 📝 License

MIT

## ⚠️ 免责声明

本项目仅供学习和研究使用。DeFi 投资有风险，请谨慎参与。
