# TEngine V2.8 升级说明

## 📋 升级概述

**版本**: V2.1 → V2.8  
**升级时间**: 待定  
**合约类型**: UUPS 代理升级  
**存储兼容性**: ✅ 100% 兼容

## 🎯 核心改进

### 1. 全局强制释放机制

**问题**: 原有的 `manualEpochOffset` 机制只是"虚拟快进时间"，不会真实扣除合约份额，对 owner 不利。

**解决方案**: 新增全局强制释放计数器机制：
- Owner 触发释放时，全局计数器 +1
- 所有用户的待领取立即包含强制释放部分（前端实时显示）
- 用户交互时自动处理累积的强制释放，真实扣除份额

### 2. 前端友好的查询

- `getPendingRewards()`: 实时显示包含强制释放的待领取金额
- `getRemainingShares()`: 实时显示扣除强制释放后的剩余份额
- `getUserForceReleaseInfo()`: 查询用户的强制释放状态

### 3. 移除旧功能

- `forceReleaseOneEpoch()` → 已废弃，改用 `triggerGlobalRelease()`
- `forceReleaseDays()` → 已废弃，改用 `triggerGlobalReleaseMultiple()`
- `manualEpochOffset` → 保留变量但不再使用（兼容存储）

---

## 📦 新增功能

### Owner 函数

#### 1. `triggerGlobalRelease()`
触发单次全网强制释放

```solidity
function triggerGlobalRelease() external onlyOwner;
```

**效果**:
- 全局计数器 +1
- 所有用户下次查询/交互时，待领取增加约 0.3% 剩余份额

**Gas 成本**: ~30,000 (仅修改一个状态变量)

#### 2. `triggerGlobalReleaseMultiple(uint256 count)`
批量触发强制释放

```solidity
function triggerGlobalReleaseMultiple(uint256 count) external onlyOwner;
```

**参数**:
- `count`: 释放次数（1-100）

**效果**:
- 全局计数器 +count
- 所有用户待领取增加 count 次 0.3% 递减释放

**Gas 成本**: ~35,000 (略高于单次)

### 查询函数

#### 1. `getUserForceReleaseInfo(address user)`
查询用户强制释放状态

```solidity
function getUserForceReleaseInfo(address user) external view returns (
    uint256 globalCount,      // 全局强制释放计数
    uint256 userProcessed,    // 用户已处理次数
    uint256 pending           // 待处理次数
);
```

#### 2. `getGlobalStatsV2_8()`
获取完整全局统计（包含强制释放信息）

```solidity
function getGlobalStatsV2_8() external view returns (
    uint256 _totalDeposited,
    uint256 _totalSharesIssued,
    uint256 _totalClaimed,
    uint256 _totalTaxCollected,
    uint256 _totalInviteRewards,
    uint256 _totalInviteRewardsTransferred,
    uint256 _currentEpoch,
    uint256 _epochDuration,
    uint256 _globalForceReleaseCount  // 新增
);
```

---

## 🔧 升级步骤

### 前置条件

1. 安装依赖
```bash
npm install
```

2. 设置环境变量
```bash
# .env 文件
TENGINE_PROXY_ADDRESS=0x你的代理合约地址
PRIVATE_KEY=你的私钥
```

### 执行升级

```bash
# 升级到 V2.8
npx hardhat run scripts/upgrade-tengine-v2_8.js --network <your-network>
```

### 升级流程

脚本自动执行以下步骤：

1. **备份当前状态** → 保存到 `backups/` 目录
2. **验证存储布局** → OpenZeppelin 自动检查兼容性
3. **部署新实现** → 部署 TEngineV2_8 合约
4. **升级代理** → 代理指向新实现
5. **初始化 V2.8** → 调用 `initializeV2_8()`
6. **验证数据** → 确认所有数据完整

---

## 🧪 测试

### 运行测试脚本

```bash
npx hardhat run scripts/test-tengine-v2_8.js --network <your-network>
```

### 测试内容

- ✅ 查看当前状态
- ✅ Owner 触发单次强制释放
- ✅ 验证用户待领取增加
- ✅ 批量强制释放功能
- ✅ 废弃函数正确拒绝
- ✅ 最终状态验证

---

## 📊 使用示例

### Owner 操作

#### 触发单次强制释放
```javascript
const tEngine = await ethers.getContractAt("TEngineV2_8", PROXY_ADDRESS);

// 触发一次强制释放（所有用户份额释放 0.3%）
const tx = await tEngine.triggerGlobalRelease();
await tx.wait();

console.log("✅ 强制释放完成");
```

#### 批量触发
```javascript
// 触发 10 次强制释放（所有用户份额释放约 3%）
const tx = await tEngine.triggerGlobalReleaseMultiple(10);
await tx.wait();

console.log("✅ 批量释放完成");
```

### 前端查询

#### 查询用户待领取（包含强制释放）
```javascript
const tEngine = new ethers.Contract(PROXY_ADDRESS, ABI, provider);

// 获取用户信息
const userInfo = await tEngine.getUserInfo(userAddress);

console.log("待领取:", ethers.utils.formatEther(userInfo.pendingRewards), "DP");
console.log("剩余份额:", ethers.utils.formatEther(userInfo.remainingShares));
```

#### 查询强制释放状态
```javascript
const forceInfo = await tEngine.getUserForceReleaseInfo(userAddress);

console.log("全局计数:", forceInfo.globalCount.toString());
console.log("已处理:", forceInfo.userProcessed.toString());
console.log("待处理:", forceInfo.pending.toString());
```

---

## ⚠️ 注意事项

### 存储兼容性

✅ **完全兼容**: 所有现有数据保持不变
- 用户份额、待领取、邀请关系等数据不受影响
- 新变量添加在存储末尾（Slot 74-75）
- 保留 `manualEpochOffset` 变量但不再使用

### 数据安全

✅ **自动备份**: 升级前自动备份所有关键数据
✅ **验证机制**: 升级后自动验证数据一致性
✅ **可回滚**: 保留备份文件用于紧急回滚

### Gas 成本

- **Owner 触发释放**: ~30,000 gas（非常低）
- **用户 claim**: 增加约 5,000-10,000 gas（处理强制释放）
- **前端查询**: 增加约 3,000 gas（仍为 view 函数，无实际成本）

---

## 🔄 回滚方案

如果升级后发现问题，可以回滚到旧版本：

```bash
# 1. 找到备份文件
ls backups/

# 2. 使用 OpenZeppelin 回滚（需要特殊权限）
# 注意：UUPS 升级通常不可直接回滚
# 建议：升级前在测试网充分测试
```

**重要**: UUPS 代理的回滚需要 owner 权限，且需要旧实现合约仍然可用。

---

## 📞 支持

如有问题，请联系开发团队或查看：
- 合约代码: `contracts/TEngineV2_8.sol`
- 升级脚本: `scripts/upgrade-tengine-v2_8.js`
- 测试脚本: `scripts/test-tengine-v2_8.js`

---

## ✅ 升级检查清单

升级前确认：
- [ ] 已在测试网测试完整流程
- [ ] 已设置正确的环境变量
- [ ] 已备份 owner 私钥
- [ ] 已通知用户升级时间
- [ ] 已准备紧急响应方案

升级后验证：
- [ ] 全局数据一致（totalDeposited, totalSharesIssued 等）
- [ ] 用户数据完整（随机抽查）
- [ ] 强制释放功能正常
- [ ] 前端查询返回正确
- [ ] 备份文件已保存

---

**版本**: V2.8  
**文档更新**: 2025-10-29  
**状态**: ✅ 准备就绪
