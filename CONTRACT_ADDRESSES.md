# 智能合约地址汇总

## Owner地址
**0xd8B4286c2f299220830f7228bab15225b4EA8379**

此地址是所有合约的管理员，拥有升级和管理权限。

---

## 主要合约（代理合约）

### 1. InvitationSystem（邀请系统）
- **代理地址**: `0xAa733E91132dF624f391f1B426F56BD231486774`
- **Owner**: `0xd8B4286c2f299220830f7228bab15225b4EA8379`
- **代理类型**: UUPS
- **合约说明**: 管理用户邀请关系和邀请奖励

### 2. TEngine（质押引擎）
- **代理地址**: `0xd9661D56659B80A875E42A51955434A0818581D8`
- **Owner**: `0xd8B4286c2f299220830f7228bab15225b4EA8379`
- **代理类型**: UUPS
- **合约说明**: 核心质押和奖励分配引擎

---

## 实现合约地址（按版本）

### TEngineV3
- `0xd76B61Aa1C9E7375195dE282C636761c25828c98`

### TEngineV2 系列
- `0x77123C2501FD37eFCDa14F32A856d32a049Da79C`
- `0x81BCc2b3d5675518aA74754971565B149Fb3C22D`
- `0x5B97cB59cE55b591036120c0B3693EeCB02889aa`

### TEngineV2_1 系列
- `0x3A5fBBD102B923b995c46a66Fc4c5CaD7a732A7D`
- `0x6097679438a24676Efd3015B968b18BE1Fce37E6`
- `0xDB220423db78a92eFD9B82d65451B83FF6b5Ad10`
- `0x05294F6429Af987251a9E186ab6A2ECA0A22b655`

### TEngineV2_6
- `0x23a912A5236A700f77c5cB6237249a895b9ea5a3`

### TEngineV4 系列
- `0x13546FAb3ef132aAeAB480e16F5916A6F5395EaC`
- `0xb4D275098A80cF84Cfeafc2ec981e27C6ae3B181`
- `0x7f53b252E9FCE1d41FeA6541D9E53DD490EA5EBB`
- `0x944338dab9aD0740C74964A3b20387173eC9C64e`

### TEngineV5 系列
- `0x713fb04695b76174eFCd43fBd8e7731B50a25D2B`
- `0xbc20C7059f80e4331a0fD5B1a4469d64e4E79420`
- `0xd0BF7CD179BAD7D5734F04F88fc65A438a4fD1D0`
- `0x414726Fa73C210571921F545311Ab0E884399d8e`
- `0x1E8ca4F1dA6261de745D79F8FB1aEF7FebA9410c`
- `0x1Ac0eEB8679116c3566Ebe264bF8239e297e57e7`
- `0x831C35DcB863de63D8E0a6307f7a1a4dDBe56469`
- `0x0c78B63aEeE40c0226Da752c9E8f1f9e6c24a3Db` (当前使用版本)

### InvitationSystem
- 实现地址记录在 `.openzeppelin/unknown-80094.json` 中

---

## 网络信息
- **网络**: Berachain Mainnet
- **Chain ID**: 80094
- **RPC**: https://rpc.berachain.com
- **浏览器**: https://beratrail.io

---

## 如何通过Owner查询

使用以下脚本可以查询合约的owner：

```javascript
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider('https://rpc.berachain.com');
const abi = ['function owner() view returns (address)'];

async function getOwner(contractAddress) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const owner = await contract.owner();
  console.log(`Owner of ${contractAddress}: ${owner}`);
  return owner;
}

// 查询代理合约的owner
getOwner('0xAa733E91132dF624f391f1B426F56BD231486774');
getOwner('0xd9661D56659B80A875E42A51955434A0818581D8');
```

---

## 注意事项

1. **所有合约都使用UUPS代理模式**，可以由owner升级
2. **代理地址保持不变**，实现合约可以升级
3. **Owner地址** `0xd8B4286c2f299220830f7228bab15225b4EA8379` 拥有所有合约的管理权限
4. 用户应该始终与**代理地址**交互，而不是实现合约地址
5. 所有历史版本的实现合约地址都记录在 `.openzeppelin/unknown-80094.json` 中

---

**生成时间**: 2025-10-31
**数据源**: `.openzeppelin/unknown-80094.json` + 链上查询
