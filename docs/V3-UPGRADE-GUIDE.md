# TEngine V2 → V3 升级指南

## 📋 升级概述

**升级目标**: 改变邀请奖励机制，从"矿池额外发放"改为"邀请人份额转移"

**关键变更**:
- ✅ V2: 邀请奖励从矿池发放，增加 `inviter.claimedShares`（提前释放）
- ✅ V3: 邀请奖励从邀请人份额扣除，减少 `inviter.totalShares`（份额转移）

---

## 🔍 存储布局对比

### V1/V2 存储布局（必须保持）

| Slot | 变量名 | 类型 | 说明 |
|------|--------|------|------|
| 0 | _initialized (Initializable) | uint8 | OpenZeppelin初始化标志 |
| 1 | _initializing (Initializable) | bool | OpenZeppelin初始化中标志 |
| ... | (gap slots from Initializable) | - | OpenZeppelin保留槽位 |
| ... | (OwnableUpgradeable slots) | - | Owner相关 |
| ... | (UUPSUpgradeable slots) | - | UUPS升级相关 |
| N | dpToken | address | DP代币地址 |
| N+1 | debearPass | address | Pass NFT地址 |
| N+2 | userInfo | mapping(address => UserInfo) | 用户信息 |
| N+3 | sharesMultiplier | uint256 | 份额倍数 (4x) |
| N+4 | dailyReleaseRate | uint256 | 每日释放率 (30 = 0.3%) |
| N+5 | totalDeposited | uint256 | 累计质押总量 |
| N+6 | totalClaimed | uint256 | 累计领取总量 |
| N+7 | deployTime | uint256 | 部署时间 |
| N+8 | claimPaused | bool | 暂停领取开关 |
| N+9 | taxRate | uint256 | 税率 |
| N+10 | taxRecipient | address | 税费接收地址 |

### V2 新增状态变量

| Slot | 变量名 | 类型 | 说明 |
|------|--------|------|------|
| N+11 | epochDuration | uint256 | 释放周期（秒）|
| N+12 | manualEpochOffset | uint256 | 手动epoch偏移 |
| N+13 | pendingInviteRewards | mapping(address => uint256) | 待领取邀请奖励 |

### V3 新增状态变量（在最后追加）

| Slot | 变量名 | 类型 | 说明 |
|------|--------|------|------|
| N+14 | totalInviteRewardsTransferred | uint256 | 累计邀请奖励转移总量 |
| N+15 | userInviteRewardsGiven | mapping(address => uint256) | 用户转出奖励统计 |
| N+16 | userInviteRewardsReceived | mapping(address => uint256) | 用户收到奖励统计 |

**✅ 存储布局兼容性**: V3在V2基础上追加新变量，不修改现有变量，确保升级安全。

---

## 🔄 核心逻辑变更

### V2 邀请奖励机制

```solidity
// V2: _processInviteReward()
function _processInviteReward(address inviter, uint256 stakeAmount) internal {
    uint256 expectedReward = (stakeAmount * rewardRate) / 100;
    uint256 inviterRemaining = userInfo[inviter].totalShares - userInfo[inviter].claimedShares;
    uint256 actualReward = min(expectedReward, inviterRemaining);
    
    if (actualReward > 0) {
        // ❌ V2: 增加claimedShares，从矿池提前释放
        userInfo[inviter].claimedShares += actualReward;
        userInfo[inviter].pendingRewards += actualReward;  // 累加到待领取
    }
}
```

**问题**: 
- 邀请人通过邀请可以"凭空"获得奖励，矿池需要额外支付
- `totalShares` 不变，`claimedShares` 增加 = 提前释放机制
- 长期会导致矿池DP不足

### V3 邀请奖励机制（新）

```solidity
// V3: _processInviteRewardV3()
function _processInviteRewardV3(address inviter, uint256 stakeAmount, address invitee) 
    internal returns (uint256) 
{
    uint256 expectedRewardShares = (stakeAmount * sharesMultiplier * rewardRate) / 100;
    uint256 inviterRemaining = userInfo[inviter].totalShares - userInfo[inviter].claimedShares;
    uint256 actualRewardShares = min(expectedRewardShares, inviterRemaining);
    
    if (actualRewardShares > 0) {
        // ✅ V3: 从邀请人totalShares中扣除，直接转移
        userInfo[inviter].totalShares -= actualRewardShares;
        
        // 统计数据
        totalInviteRewardsTransferred += actualRewardShares;
        userInviteRewardsGiven[inviter] += actualRewardShares;
        userInviteRewardsReceived[invitee] += actualRewardShares;
        
        emit InviteRewardTransferred(inviter, invitee, actualRewardShares, ...);
    }
    
    return actualRewardShares;  // 被邀请人获得这些额外份额
}
```

**优势**:
- ✅ 邀请人分享自己的份额，不额外消耗矿池
- ✅ 被邀请人获得: `baseShares + inviteBonus`
- ✅ 零和游戏：邀请人减少的份额 = 被邀请人增加的份额
- ✅ 矿池总质押量不变，只是份额重新分配

---

## 📊 数据示例对比

### 场景: Alice邀请Bob

**初始状态**:
- Alice: totalShares = 4000, claimedShares = 0
- Bob: 质押 100 DP，基础份额 = 400 (100 × 4倍)
- 邀请奖励率: 8% (Standard Pass)

**V2机制**:
```
Bob质押后:
  Alice.totalShares = 4000 (不变)
  Alice.claimedShares = 32 (增加, 400 × 8%)
  Alice.pendingRewards = 32 (可立即领取32 DP)
  
  Bob.totalShares = 400 (基础份额)
  
矿池影响: 需要额外支付32 DP给Alice ❌
```

**V3机制**:
```
Bob质押后:
  Alice.totalShares = 3968 (减少32份额, 4000 - 32)
  Alice.claimedShares = 0 (不变)
  
  Bob.totalShares = 432 (基础400 + 奖励32)
  
矿池影响: 无额外支出，只是份额从Alice转移到Bob ✅
```

---

## 🚀 升级步骤

### 1. 准备工作

```bash
# 检查当前合约状态
npx hardhat run scripts/check-current-state.js --network mainnet

# 编译V3合约
npx hardhat compile

# 运行测试（可选，在测试网）
npx hardhat test test/TEngineV3.test.js
```

### 2. 执行升级

```bash
# 升级到V3
npx hardhat run scripts/upgrade-to-v3.js --network mainnet

# 输出示例:
# ============================================================
# 🚀 开始升级 TEngine V2 -> V3
# ============================================================
# 部署账户: 0xYourAddress
# 
# 📦 步骤1: 部署 TEngineV3 实现合约...
# ✅ 代理合约: 0xd9661D56659B80A875E42A51955434A0818581D8
# ✅ 新实现V3: 0xNewImplementationAddress
# 
# 🔧 步骤2: 初始化V3新变量...
# ✅ V3初始化成功
# 
# 🔍 步骤3: 验证升级结果...
# ✅ 升级完成!
```

### 3. 验证升级

```bash
# 在区块链浏览器验证合约
npx hardhat verify --network mainnet <NEW_IMPLEMENTATION_ADDRESS>

# 测试V3邀请机制
npx hardhat run scripts/test-v3-invite.js --network mainnet
```

---

## ⚠️ 重要注意事项

### 存储安全
- ✅ V3在V2基础上追加变量，不删除或修改现有变量
- ✅ UserInfo结构体保持3个字段（无变化）
- ✅ 所有mapping都是新增的独立存储槽

### 向后兼容
- ✅ V2的 `pendingInviteRewards` 依然可用，在claim时会清空
- ✅ 现有用户数据（totalShares, claimedShares）完全保留
- ✅ 所有V2的管理函数继续有效

### 升级后影响
- **对现有用户**: 无影响，份额、已领取数据完全保留
- **对新用户**: 使用新的邀请机制（份额转移）
- **对邀请人**: 
  - V3升级前的邀请奖励: 依然在 `pendingInviteRewards`，可正常领取
  - V3升级后的邀请奖励: 直接从 `totalShares` 扣除，立即生效

---

## 🧪 测试清单

- [ ] 存储布局验证（通过OpenZeppelin Upgrades插件）
- [ ] 现有用户数据完整性检查
- [ ] 新邀请奖励机制测试（份额扣除）
- [ ] 边界情况测试（邀请人份额不足）
- [ ] 统计数据准确性验证
- [ ] 事件触发正确性
- [ ] claim()功能正常（包含V2遗留数据）
- [ ] 所有owner管理功能可用

---

## 📞 升级后监控

### 关键指标
1. **totalInviteRewardsTransferred**: 累计转移份额总量
2. **事件监控**: 监听 `InviteRewardTransferred` 事件
3. **矿池余额**: 确保不会因邀请奖励而减少
4. **用户统计**: 通过 `getUserInviteStats()` 查询邀请数据

### 查询命令
```javascript
// 查询全局统计
await tengine.totalInviteRewardsTransferred();

// 查询用户统计
const [given, received] = await tengine.getUserInviteStats(userAddress);

// 查询完整信息（包含邀请统计）
const info = await tengine.getUserFullInfo(userAddress);
```

---

## 📝 V3新增功能

### 新增查询方法
1. `getUserInviteStats(address)` - 查询用户邀请奖励统计
2. `getUserFullInfo(address)` - 一次性查询用户所有信息（含邀请统计）

### 新增状态变量
1. `totalInviteRewardsTransferred` - 全局累计转移份额
2. `userInviteRewardsGiven[user]` - 用户转出奖励总量
3. `userInviteRewardsReceived[user]` - 用户收到奖励总量

### 新增事件
```solidity
event InviteRewardTransferred(
    address indexed inviter,
    address indexed invitee,
    uint256 rewardShares,
    uint256 expectedShares,
    uint256 inviterRemainingShares
);
```

---

## 🎯 V2 vs V3 快速对比

| 特性 | V2 | V3 |
|------|----|----|
| 邀请奖励来源 | 矿池额外发放 | 邀请人份额转移 |
| 邀请人变化 | `claimedShares += 奖励` | `totalShares -= 奖励` |
| 被邀请人获得 | 基础份额 | 基础份额 + 奖励份额 |
| 矿池影响 | 需要额外支付 ❌ | 无影响，零和游戏 ✅ |
| 长期可持续性 | 可能DP不足 | 完全可持续 ✅ |
| 统计数据 | 无 | 详细记录转入/转出 |

---

## 🔗 相关文件

- **合约**: `contracts/TEngineV3.sol`
- **升级脚本**: `scripts/upgrade-to-v3.js`
- **测试脚本**: `scripts/test-v3-invite.js`
- **部署记录**: `upgrade-v3-deployment.json` (升级后生成)

---

## 📌 总结

V3升级核心理念: **将邀请奖励从"矿池支出"改为"份额转移"**，实现真正的零和博弈，确保矿池长期可持续运行。

升级安全保障:
- ✅ 存储布局完全兼容
- ✅ 现有数据零影响
- ✅ 向后兼容V2遗留数据
- ✅ OpenZeppelin UUPS标准升级
