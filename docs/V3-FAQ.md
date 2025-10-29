# TEngineV3 常见问题 (FAQ)

## ❓ 核心问题

### 1. V3中邀请人会获得DP吗？

**❌ 不会！邀请人在V3中不会获得任何DP！**

**V2机制**（旧）：
```
Alice邀请Bob → Alice获得待领取奖励（pendingRewards += 32）
                → Alice调用claim()后获得32 DP到钱包 ✅
```

**V3机制**（新）：
```
Alice邀请Bob → Alice的份额减少（totalShares -= 32）
                → Alice不获得任何DP ❌
                → Bob获得额外32份额 ✅
```

**详细分析**：[V3邀请奖励流程详解](V3-INVITE-REWARD-FLOW.md)

---

### 2. 那邀请人有什么好处？

在V3中，邀请人**没有直接的DP奖励**，但：

| 收益类型 | V2 | V3 |
|---------|----|----|
| 立即DP奖励 | ✅ 有（待领取） | ❌ 无 |
| 份额损失 | 无 | 有（减少） |
| 生态贡献 | 有 | 有（更重要） |
| 间接收益 | 项目成功受益 | 项目成功受益 |

**V3的设计哲学**：
- 邀请不是"免费获利"，而是"分享自己的份额"
- 鼓励真正相信项目的人去邀请
- 避免纯粹为奖励而疯狂邀请

---

### 3. 被邀请人在V3中有什么变化？

**被邀请人在V3中获得更多！**

| 场景 | V2 | V3 |
|------|----|----|
| Bob质押100 DP | 获得400份额 | 获得432份额（400+32） ✅ |
| 每日释放 | 1.2 DP/天 | 1.296 DP/天 ✅ |

**V3对被邀请人更友好！**

---

### 4. V3邀请奖励到底发生了什么？

**份额转移，而非DP发放！**

```
Alice（邀请人）质押1000 DP:
  初始: totalShares = 4000

Bob质押100 DP（Alice邀请）:
  1. 计算奖励份额: 100 × 4 × 8% = 32份额
  2. 从Alice扣除: Alice.totalShares = 4000 - 32 = 3968
  3. 转给Bob: Bob.totalShares = 400 + 32 = 432
  
结果:
  - Alice份额减少32
  - Bob份额增加32  
  - 总份额不变（零和游戏）
  - 矿池不需要额外支付DP ✅
```

---

### 5. V2遗留的待领取奖励怎么办？

**V2遗留奖励依然可以领取！**

如果升级前已经有`pendingInviteRewards`：
```solidity
// V3的claim()方法会处理V2遗留数据
uint256 pendingInvite = pendingInviteRewards[msg.sender];
// 依然可以领取
pendingInviteRewards[msg.sender] = 0; // 清空
```

**但升级到V3后，新的邀请不会再产生待领取奖励！**

---

### 6. 为什么V3要改变邀请机制？

**V2机制的问题**：

```
假设100人每人邀请10人:
  矿池需要额外支付: 100 × 10 × 100DP × 8% = 8000 DP ❌
  
随着邀请增多，矿池负担越来越重，不可持续！
```

**V3机制的优势**：

```
100人每人邀请10人:
  矿池额外支付: 0 DP ✅
  
只是份额在用户之间转移，矿池无负担，完全可持续！
```

---

### 7. admin.html需要修改吗？

**❌ 不需要！**

TEngineV3已添加向后兼容方法：
- `totalInviteRewards()` - 兼容V2的ABI
- `totalTaxCollected()` - 兼容V2的ABI

admin.html的所有Owner功能100%兼容：
- ✅ 设置份额倍数
- ✅ 设置每日释放率
- ✅ 暂停/恢复领取
- ✅ 设置税率和接收地址
- ✅ 设置释放周期时长
- ✅ 强制提前释放

**详细验证**：[admin.html兼容性文档](V3-ADMIN-COMPATIBILITY.md)

---

### 8. 如何测试V3邀请机制？

```bash
# 1. 编译合约
npx hardhat compile

# 2. 升级到V3（测试网）
npx hardhat run scripts/upgrade-to-v3.js --network sepolia

# 3. 测试邀请机制
npx hardhat run scripts/test-v3-invite.js --network sepolia
```

**测试要点**：
- ✅ 邀请人的totalShares是否减少
- ✅ 被邀请人的totalShares是否增加（基础+奖励）
- ✅ 事件`InviteRewardTransferred`是否触发
- ✅ 矿池余额是否保持不变

---

### 9. V3如何查询邀请统计？

**V3新增查询方法**：

```javascript
// 查询用户邀请统计（转出/收到的份额）
const [given, received] = await tengine.getUserInviteStats(userAddress);

// 查询完整用户信息（包含邀请统计）
const info = await tengine.getUserFullInfo(userAddress);
// 返回: [totalShares, claimedShares, remainingShares, claimableNow,
//        lastClaimEpoch, currentEpoch, inviteRewardsGiven, inviteRewardsReceived]

// 查询全局累计邀请转移总量
const total = await tengine.totalInviteRewardsTransferred();
```

---

### 10. V3升级后用户需要做什么？

**现有用户：零操作！**
- ✅ 所有数据完全保留
- ✅ 份额不受影响
- ✅ 正常claim领取
- ✅ V2遗留的待领取奖励可正常领取

**新用户：正常使用！**
- ✅ 质押DP进入矿池
- ✅ 如果被邀请，获得额外份额
- ✅ 按释放周期领取奖励

**邀请人：理解新机制！**
- ⚠️ 邀请会减少自己的份额
- ⚠️ 不会获得待领取DP
- ✅ 但帮助生态成长

---

## 📊 快速对比表

| 特性 | V2 | V3 |
|------|----|----|
| **邀请人获得DP** | ✅ 是（待领取） | ❌ 否 |
| **邀请人份额变化** | 不变 | 减少⬇️ |
| **被邀请人额外份额** | 无 | 有⬆️ |
| **矿池额外支出** | 有❌ | 无✅ |
| **长期可持续性** | 否 | 是✅ |
| **零和游戏** | 否 | 是✅ |

---

## 🎯 关键结论

1. **V3邀请人不会获得DP**（既不是立即到钱包，也不是待领取）
2. **V3邀请是份额转移**（从邀请人转给被邀请人）
3. **V3对被邀请人更友好**（获得额外份额）
4. **V3矿池零负担**（完全可持续）
5. **admin.html无需修改**（100%兼容）

---

## 📖 更多文档

- 📖 [快速开始](../V3-UPGRADE-README.md)
- 📖 [详细升级指南](V3-UPGRADE-GUIDE.md)
- 📖 [邀请奖励流程详解](V3-INVITE-REWARD-FLOW.md)
- 📖 [V2 vs V3对比](V2-VS-V3-COMPARISON.md)
- 📖 [admin.html兼容性](V3-ADMIN-COMPATIBILITY.md)
- 📖 [最终验证报告](../V3-FINAL-REPORT.md)

---

**有问题？查看完整文档或联系开发团队！**
