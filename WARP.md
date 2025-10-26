# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Debear Party is a Web3 GameFi platform built for Berachain (Chain ID: 80094). It's a hybrid dApp combining a static frontend with smart contract integration for NFT passes, token mining, and DeFi features.

## Development Commands

### Local Development
```powershell
# Start local development server
npm run dev
# or
npm start

# Server will be available at http://localhost:3000
# Serves static HTML files with CORS headers enabled
```

### Smart Contract Development (Hardhat)
```powershell
# Compile smart contracts
npm run compile

# Run smart contract tests
npm run test

# Deploy to local network
npm run deploy-local

# Deploy to Berachain mainnet
npm run deploy
```

### Docker Deployment
```powershell
# Build Docker image
docker build -t debear-party .

# Run containerized version (exposes port 8080)
docker run -p 8080:8080 debear-party
```

### Testing Individual Components
The project doesn't have a traditional test runner for frontend code. Manual testing is done by:
1. Starting the dev server with `npm run dev`
2. Opening specific HTML pages (index.html, gamefi.html, admin.html, etc.)
3. Testing wallet connection and blockchain interactions

## Architecture Overview

### Project Structure
- **Static Frontend**: Multiple HTML pages with embedded CSS/JS for different features
- **Smart Contracts**: Hardhat-based development environment for Berachain deployment
- **API Integration**: Kodiak Finance DEX integration for token swapping
- **Wallet Integration**: Supports MetaMask and OKX Wallet for Berachain connectivity

### Key Components

#### Frontend Architecture
- **Multi-Page Application**: Each feature has its own HTML file:
  - `index.html`: Landing page and main navigation
  - `gamefi.html`: GameFi features and NFT interactions
  - `admin.html`: Owner/admin control panel
  - `swap.html`: DEX swap interface
  - `pass-nft.html`: NFT Pass purchasing
  - `t-engine.html`: Token mining interface
  - `whitepaper.html`: Project documentation

#### Shared Components (`js/common.js`)
- `WalletManager`: Handles wallet connections (MetaMask/OKX)
- `ToastManager`: Global notification system
- `LoadingManager`: Loading state management
- `CONFIG`: Global configuration (chain ID, contracts, etc.)

#### Styling System (`css/common.css`)
- CSS custom properties for consistent theming
- Neon cyberpunk aesthetic with gradients
- Responsive design with mobile-first approach
- Particle.js integration for animated backgrounds

#### External Integrations
- **Kodiak Finance API** (`kodiak-api.js`): DEX integration for token swapping
- **Berachain Network**: Native blockchain integration (Chain ID: 80094)
- **Web3 Libraries**: Ethers.js v5 for blockchain interactions

### Smart Contract Integration
The project expects Hardhat contracts to be deployed and configured with:
- DPToken: Main project token
- DebearPass: NFT passes (Standard, Premium, Exclusive)
- PassSale: NFT pass purchase contract
- NFTMining: NFT staking and reward system
- TEngine: Token mining/yield farming

### Key Configuration
- **Owner Address**: `0xd8b4286c2f299220830f7228bab15225b4ea8379`
- **Berachain Chain ID**: 80094 (mainnet)
- **Token Standards**: ERC-20 (DPToken), ERC-721 (DebearPass)

## Development Guidelines

### Wallet Integration
- Always check for both MetaMask (`window.ethereum`) and OKX (`window.okxwallet`)
- Handle network switching to Berachain (Chain ID: 80094)
- Implement proper error handling for wallet connection failures

### UI/UX Patterns
- Use the global toast system for user feedback
- Implement loading states for blockchain transactions
- Follow the established neon gradient design system
- Maintain responsive design principles

### Smart Contract Interactions
- Use Ethers.js v5 (loaded via CDN)
- Implement proper gas estimation and error handling
- Always validate contract addresses and function calls
- Handle transaction pending states with loading indicators

### Testing Approach
- Manual testing with actual wallet connections
- Test on Berachain testnet before mainnet deployment
- Verify smart contract interactions through admin panel
- Cross-browser testing (Chrome, Firefox, Edge)

## Important Notes

- This is a production deployment targeting Berachain mainnet
- No automated test framework is configured for frontend code
- Smart contract testing uses Hardhat's built-in test framework
- Static file server includes security headers and CORS configuration
- Mobile responsiveness is implemented but requires testing on actual devices