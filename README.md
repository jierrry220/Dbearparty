# Debear Party - Web3 DApp

一个基于 Berachain 的 Web3 去中心化应用，提供 NFT Pass 销售、挖矿、邀请系统和分红池功能。

## 🚀 功能特性

- **钱包连接**: 支持 MetaMask 和 OKX Wallet
- **NFT Pass 系统**: NFT Pass 查看、购买和管理
- **挖矿系统**: NFT 挖矿和 T-Engine 质押挖矿
- **邀请系统**: 多级邀请奖励机制
- **分红池**: 自动分红和收益分配

## 🛠 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js, HTTP Server
- **区块链**: Solidity, Hardhat, OpenZeppelin
- **网络**: Berachain Mainnet (Chain ID: 80094)

## 📦 部署到 Zeabur

### 方法一：直接部署

1. 登录 [Zeabur](https://zeabur.com)
2. 创建新项目
3. 连接 GitHub 仓库
4. 选择此项目进行部署
5. Zeabur 会自动检测 `package.json` 和 `Dockerfile`

### 方法二：使用 Zeabur CLI

```bash
# 安装 Zeabur CLI
npm install -g @zeabur/cli

# 登录
zeabur auth login

# 部署
zeabur deploy
```

## 🔧 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
# 或
npm run dev
```

服务器将在 `http://localhost:3000` 启动

### 编译合约

```bash
npm run compile
```

### 运行测试

```bash
npm test
```

## 🌐 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 网络配置
PRIVATE_KEY=your_private_key_here
BERACHAIN_RPC_URL=https://rpc.berachain.com

# 部署配置
NODE_ENV=production
PORT=3000
```

## 📁 项目结构

```
debear-party/
├── contracts/          # 智能合约
│   ├── mining/         # 挖矿相关合约
│   ├── nft/           # NFT 合约
│   ├── sales/         # 销售合约
│   ├── system/        # 系统合约
│   └── token/         # 代币合约
├── deployments/       # 部署配置
├── scripts/          # 部署和管理脚本
├── test/            # 测试文件
├── metadata/        # NFT 元数据
├── server.js        # Web 服务器
├── test-dapp.html   # 前端页面
├── Dockerfile       # Docker 配置
└── zeabur.json     # Zeabur 部署配置
```

## 🔗 智能合约

### 核心合约

- **DPToken**: ERC20 代币合约
- **DebearPass**: ERC721 NFT Pass 合约
- **InvitationSystem**: 邀请系统合约
- **PassSale**: NFT Pass 销售合约
- **TEngine**: T-Engine 质押挖矿合约
- **NFTMiningPool**: NFT 挖矿池合约

### 合约地址 (Berachain Mainnet)

详见 `deployments/` 目录中的部署配置文件。

## 🔐 安全注意事项

- 确保私钥安全，不要提交到代码仓库
- 使用环境变量管理敏感配置
- 定期更新依赖包
- 在主网部署前充分测试

## 📞 支持

如有问题，请联系开发团队或提交 Issue。

## 📄 许可证

MIT License
