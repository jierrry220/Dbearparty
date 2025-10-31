# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Debear Party** is a comprehensive Web3 DeFi platform built on Berachain mainnet, integrating DeFi, NFT, and GameFi features. The project uses Hardhat for smart contract development and includes a Node.js web server for the frontend.

## Essential Commands

### Development Server
```powershell
# Start local development server (port 3000)
npm start
# or
npm run dev
```

### Smart Contract Development
```powershell
# Compile all Solidity contracts
npm run compile
# Equivalent to: hardhat compile

# Run all tests
npm run test
# Equivalent to: hardhat test

# Run specific test file
npx hardhat test test/TEngineV4.test.js

# Run compile verification test
npm run test-compile

# Run invitation chain test
npm run test-invite
```

### Contract Deployment & Upgrades
```powershell
# Deploy to Berachain mainnet
npm run deploy

# Deploy to localhost (requires local node)
npm run deploy-local

# Upgrade TEngine contract on mainnet
npm run upgrade

# Upgrade TEngine on localhost
npm run upgrade-local
```

### Network Configuration
- **Berachain Mainnet**: Chain ID 80094, RPC: https://rpc.berachain.com
- **Local/Hardhat**: Chain ID 1337, RPC: http://127.0.0.1:8545
- **Testnet**: Berachain Artio (Chain ID 80084)

## Architecture Overview

### Smart Contract System

The project uses **UUPS upgradeable proxy pattern** (OpenZeppelin) for all core contracts. This is critical - never modify storage layout order when upgrading contracts.

#### Core Contracts (contracts/)

1. **DPToken_v1.1.0.sol** - ERC-20 token
   - Total supply: 1 billion DP tokens
   - Features: Burnable, Pausable, UUPS upgradeable
   - Burn mechanism: Required for TEngine staking
   - Emergency pause functionality for security

2. **DebearPass_v1.1.0.sol** - ERC-1155 NFT
   - Three Pass tiers: Standard (ID=1), Premium (ID=2), Exclusive (ID=3)
   - Each tier has different mining multipliers and invite reward rates
   - Max supply per tier: Standard=1300, Premium=500, Exclusive=200
   - Freely tradeable NFTs

3. **TEngineV5.sol** - Core staking/mining engine (MOST COMPLEX)
   - Users burn DP tokens to receive shares (4x multiplier by default)
   - Daily release mechanism: 0.3% of remaining shares per day
   - Invitation reward system: rewards transfer shares from inviter to invitee
   - Force release mechanism for owner-triggered batch releases
   - Storage layout compatibility: V1 → V2 → V3 → V4 → V5 upgrade path
   - **CRITICAL**: Never reorder storage variables when upgrading

4. **InvitationSystemV2.sol** - Invitation/referral system
   - Manages invitation relationships and prevents circular invites
   - Max invitation depth: 50 levels
   - Authorization system for contract interactions
   - V2 adds ability to reset invitation relationships

5. **PassSale.sol** - NFT Pass sales contract
   - Users pay BERA to buy Pass NFTs
   - Automatic invitation binding and BERA reward distribution
   - Transfers Pass from salesWallet to buyer
   - Distributes BERA: invite rewards → inviter, remainder → treasury

#### Contract Interaction Flow

```
User Stakes DP → TEngine burns DP → User receives shares
                    ↓
                Checks invitation relationship (InvitationSystem)
                    ↓
                If invited: Transfer shares from inviter to invitee
                    ↓
                Daily release: 0.3% of remaining shares claimable
                    ↓
                User claims → Receives DP minus 10% tax
```

### Frontend Architecture

- **Server**: Simple Node.js HTTP server (server.js)
- **Pages**: Multiple HTML pages for different features
  - index.html: Landing page
  - swap.html: DEX token swap (Kodiak integration)
  - pass.html: NFT Pass purchase
  - t-engine.html: Staking/mining interface
  - admin.html: Owner/admin panel
  - whitepaper.html: Project documentation

- **API Routes**:
  - /api/ave-price: Ave Protocol price data (api/ave-price.js)
  - /api/ave-proxy: Ave Protocol proxy (api/ave-proxy.js)

- **External APIs**:
  - ave-api.js: Ave Protocol integration
  - kodiak-api.js: Kodiak DEX integration
  - price-chart.js: Price chart functionality

### Storage Layout Compatibility (CRITICAL)

When upgrading TEngine contracts, storage layout MUST be preserved:

**V1-V4 Core Variables (Slots 52-74)**:
- dpToken, invitationSystem (address)
- taxRecipient, defaultInviter (address)
- deployTime, sharesMultiplier, dailyReleaseRate, taxRate (uint256)
- userInfo mapping, statistics
- debearPass, releaseDayDuration, manualDayOffset (V4 additions)

**V5 Additions (Slot 75+)**:
- globalForceReleaseCount
- userProcessedForceReleases mapping

**NEVER reorder existing variables. Always append new variables at the end.**

### Upgrade Pattern

The project has extensive upgrade infrastructure in scripts/:
- upgrade-*.js: Various upgrade scripts (v2 → v3 → v4 → v5 → v5.1)
- verify-*.js: Verification scripts after upgrade
- rollback-*.js: Emergency rollback scripts
- check-*.js: State checking and validation

Key upgrade considerations:
1. Always backup current state (JSON files in backups/)
2. Test on localhost first with upgrade-local scripts
3. Verify storage layout compatibility
4. Use reinitializer(version) for new state variables
5. Emit events to track upgrade execution

## Testing Strategy

Tests are in test/ directory:
- TEngineV4.test.js: Full V4 functionality tests
- TEngineV4.simple.test.js: Simplified test suite
- TEngineV4.verification.test.js: Verification tests
- TEngineV2_5.test.js: V2.5 specific tests

Tests use:
- Hardhat network helpers for time manipulation
- Mock contracts (contracts/mocks/Mocks.sol)
- OpenZeppelin upgrades plugin
- Chai matchers for assertions

## Project Structure Notes

- **contracts/**: All Solidity smart contracts
  - Main contracts at root level
  - mocks/: Mock contracts for testing
  - 无用/: Unused/deprecated contracts (excluded from compilation)

- **scripts/**: 100+ deployment, upgrade, and management scripts
  - Heavy focus on upgrade safety with verification scripts
  - Storage layout validation tools
  - Invitation system diagnostic tools

- **docs/**: Upgrade guides and architecture documentation
  - V3-UPGRADE-GUIDE.md: Details V2→V3 invitation reward mechanism change
  - V3-FAQ.md: Common questions about V3 changes
  - Other version-specific docs

- **api/**: Serverless function handlers (Vercel-compatible)
- **js/**: Frontend JavaScript utilities (i18n, common functions)
- **css/**: Stylesheets

## Environment Configuration

Environment variables are loaded from contracts/.env:
- PRIVATE_KEY: Deployment account private key
- Network configuration in hardhat.config.js

## Deployment Platforms

The project supports multiple deployment platforms:
- Vercel (vercel.json configuration)
- Zeabur (zeabur.json, zbpack.json)
- Docker (dockerfile, .dockerignore)

## Important Development Notes

1. **Storage Layout**: When upgrading UUPS contracts, NEVER reorder storage variables. Always append new variables.

2. **Invitation Mechanism Evolution**:
   - V2: Inviter receives DP rewards from pool
   - V3+: Inviter's shares are transferred to invitee (zero-sum system)
   - This prevents pool depletion from excessive referrals

3. **Pass NFT System**: Three-tier system with different benefits:
   - Standard: 1x multiplier, 5% invite rate
   - Premium: 3.5x multiplier, 8% invite rate
   - Exclusive: 7x multiplier, 12% invite rate

4. **TEngine Share Mechanics**:
   - Default 4x share multiplier on deposits
   - 0.3% daily release rate (configurable)
   - 10% tax on claims (configurable)
   - Force release mechanism for owner-triggered releases

5. **Contract Authorization**: InvitationSystem and TEngine have mutual authorization requirements. Ensure both contracts authorize each other.

6. **Testing Time Manipulation**: Tests use hardhat network helpers to advance time. Be aware of this when debugging test failures.

7. **Upgrade Scripts**: Many upgrade scripts in scripts/ directory. Key scripts often have multiple versions (_v2, _v3, _v4, _REAL, etc.). Always review script content before running on mainnet.
