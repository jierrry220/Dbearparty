# Admin 控制台 V5 强制释放功能更新

## 🎯 更新内容

### 1. 新增 V5 全局强制释放控制面板

**位置**: `owner/admin.html` 第 239-281 行

**功能模块**:

#### 📊 显示全局强制释放计数器
- **位置**: T-Engine 状态面板底部
- **显示**: `🚀 全局强制释放计数器 (V5): 当前值`
- **实时更新**: 每次刷新页面时自动读取

#### 🚀 单次强制释放
```javascript
按钮: "🚀 触发单次强制释放"
功能: globalForceReleaseCount +1
效果: 所有用户同步增加 0.3% 递减释放量
```

#### 🚀 批量强制释放
```javascript
输入: 释放次数（1-100）
按钮: "🚀 批量释放"
功能: globalForceReleaseCount +N
效果: 所有用户同步增加 N×0.3% 递减释放量
```

#### 🔄 重置全局计数器（修复新用户 bug）
```javascript
输入: 新计数器值（推荐输入 0）
按钮: "⚠️ 重置计数器"
功能: 设置 globalForceReleaseCount = 输入值
特殊: 当输入 0 时，会显示专门的修复说明
```

---

## 🔧 技术实现

### ABI 更新
```javascript
const TENGINE_ABI = [
  // ... 其他方法
  'function triggerGlobalRelease()',
  'function triggerGlobalReleaseMultiple(uint256 count)',
  'function resetForceReleaseCounters(uint256 newCount)',
  'function globalForceReleaseCount() view returns (uint256)',  // ✅ 已修复拼写错误
  'function owner() view returns (address)'
];
```

### 读取方法（第 604-614 行）
```javascript
try {
  const globalCounter = await ten.globalForceReleaseCount();
  $('currGlobalForceCounter').textContent = globalCounter.toString();
  console.log('✅ V5 全局强制释放计数器:', globalCounter.toString());
} catch (v5Error) {
  console.warn('V5 globalForceReleaseCount 不可用，未升级到 V5:', v5Error);
  $('currGlobalForceCounter').textContent = '需升级 V5';
}
```

### 重置方法（第 817-835 行）
```javascript
$('btnResetForceReleaseCounters').onclick = async () => {
  const newCount = parseInt(($('resetCounterValue').value||'0').trim(), 10);
  
  // 智能提示：重置为 0 时显示修复说明
  let confirmMsg = `⚠️ 确定要重置全局计数器为 ${newCount} 吗？\n\n`;
  
  if (newCount === 0) {
    confirmMsg += `💡 重置为 0 的作用：
• 修复新用户 bug：新用户不能领取历史强制释放
• 已 claim 的老用户：不受影响，已领取的不会被撤回
• 未 claim 的老用户：会失去待领取的历史释放

这是推荐的修复方案！`;
  } else {
    confirmMsg += `这是一个重大操作！...`;
  }
  
  if (!confirm(confirmMsg)) return;
  
  const ten = await withSigner(CONTRACTS.tEngine, TENGINE_ABI);
  const tx = await ten.resetForceReleaseCounters(newCount);
  await tx.wait();
  
  setMsg('msgV5ForceRelease', `✅ 全局计数器已重置为 ${newCount}`);
  await refreshTEngine();
};
```

---

## 🎨 UI 设计

### 控制面板样式
```css
背景: #1e293b (深灰蓝色)
边框: 2px solid #f59e0b (琥珀色)
标题: 🚀 V5 全局强制释放控制
颜色: #fbbf24 (琥珀色)
```

### 按钮样式
- **单次/批量释放**: `btn warning` (琥珀色 #f59e0b)
- **重置计数器**: `btn danger` (红色 #ef4444)
- **消息提示**: 绿色成功 / 红色失败

### 提示文案
```html
⭐ 每次强制释放会增加全局计数器，所有用户同步增加 0.3% 递减释放量。
🚨 注意：强制释放会立即触发，无法撤销！

💡 重置为 0：新用户不能领取历史强制释放（修复 bug）
⚠️ 已 claim 的老用户不受影响，未 claim 的会失去待领取的历史释放
```

---

## 📋 使用指南

### 修复新用户 bug（推荐操作）

1. **连接钱包**: 确保使用 Owner 钱包
2. **定位面板**: 滚动到 "🚀 V5 全局强制释放控制" 面板
3. **输入值**: 在"重置全局计数器"输入框中输入 `0`
4. **点击按钮**: 点击"⚠️ 重置计数器"
5. **确认操作**: 阅读弹窗提示，点击"确定"
6. **等待确认**: 等待交易确认
7. **验证结果**: 查看"全局强制释放计数器"显示为 `0`

### 触发全局强制释放

#### 单次释放
1. 点击 "🚀 触发单次强制释放"
2. 确认弹窗
3. 等待交易确认
4. 计数器 +1

#### 批量释放
1. 输入释放次数（例如: `5`）
2. 点击 "🚀 批量释放"
3. 确认弹窗（会显示总释放百分比）
4. 等待交易确认
5. 计数器 +5

---

## ✅ 测试验证

### 测试场景 1: 查看计数器
1. 连接钱包
2. 页面自动加载
3. 查看 T-Engine 面板底部
4. 确认显示当前计数器值

### 测试场景 2: 重置为 0
1. 输入 `0`
2. 点击重置
3. 确认弹窗内容包含修复说明
4. 确认交易
5. 验证计数器显示为 `0`

### 测试场景 3: 触发释放
1. 点击单次释放
2. 确认交易
3. 刷新页面
4. 验证计数器 +1

---

## 🔄 更新记录

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2025-10-30 | V5.1 | 修复 ABI 拼写错误 (`globalForceReleaseCounter` → `globalForceReleaseCount`) |
| 2025-10-30 | V5.1 | 优化重置按钮提示文案，突出修复新用户 bug 的作用 |
| 2025-10-30 | V5.1 | 添加智能确认对话框，重置为 0 时显示详细修复说明 |

---

## 🎉 完成状态

✅ **V5 全局强制释放功能已完全集成到 Admin 控制台**

- ✅ 读取全局计数器
- ✅ 显示实时计数器值
- ✅ 单次强制释放按钮
- ✅ 批量强制释放按钮
- ✅ 重置计数器按钮（含修复说明）
- ✅ 智能确认对话框
- ✅ 错误处理和消息提示
- ✅ 自动刷新功能

**Admin 面板已就绪，可以使用！** 🚀

---

**更新时间**: 2025-10-30 14:10 (北京时间)  
**文件路径**: `owner/admin.html`  
**合约地址**: `0xd9661D56659B80A875E42A51955434A0818581D8` (TEngine V5)
