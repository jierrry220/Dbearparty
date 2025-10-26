# Debear Party 国际化 (i18n) 使用指南

## 概述
本项目已实现完整的国际化功能，支持**英文 (en)** 和**繁体中文 (zh-TW)**，默认显示英文。

## 已完成的工作

### 1. 核心文件
- ✅ **js/i18n.js** - 国际化配置和管理系统
- ✅ **index.html** - 首页已完全支持国际化
- ✅ **js/common.js** - 公共功能已集成国际化

### 2. 功能特点
- 默认语言：英文 (en)
- 支持语言：英文 (en) 和繁体中文 (zh-TW)
- 语言切换按钮在导航栏右侧
- 语言选择会保存到 localStorage，刷新页面后保持
- 自动检测新添加的元素并应用翻译

## 如何为其他页面添加国际化

### 步骤 1: 在 HTML 中引入 i18n.js

在页面的 `</body>` 标签前添加：

```html
<!-- 国际化配置 -->
<script src="js/i18n.js"></script>
```

### 步骤 2: 添加语言切换器

在导航栏的 `.nav-buttons` 中添加语言切换器：

```html
<div class="nav-buttons">
    <!-- 语言切换器 -->
    <div class="lang-switcher">
        <button class="lang-btn">EN</button>
        <div class="lang-dropdown">
            <div class="lang-option active" data-lang="en" onclick="window.i18n?.setLanguage('en')">
                <span data-i18n="lang.en">English</span>
            </div>
            <div class="lang-option" data-lang="zh-TW" onclick="window.i18n?.setLanguage('zh-TW')">
                <span data-i18n="lang.zh">繁體中文</span>
            </div>
        </div>
    </div>
    <button class="connect-btn" onclick="connectWallet()" data-i18n="nav.connect">Connect Wallet</button>
    <!-- 其他按钮... -->
</div>
```

### 步骤 3: 为文本元素添加 data-i18n 属性

对于需要翻译的文本，添加 `data-i18n` 属性：

```html
<!-- 导航链接 -->
<a href="index.html" data-i18n="nav.home">Home</a>
<a href="swap.html" data-i18n="nav.swap">Swap</a>

<!-- 标题 -->
<h1 data-i18n="hero.title">Debear Party</h1>

<!-- 段落 -->
<p data-i18n="hero.description">Hold Pass NFT, Participate in Mining, Earn Rewards</p>

<!-- 按钮 -->
<button data-i18n="nav.connect">Connect Wallet</button>
```

### 步骤 4: 在 i18n.js 中添加翻译文本

打开 `js/i18n.js`，在 `translations` 对象中添加新的键值对：

```javascript
const translations = {
    en: {
        // 添加英文翻译
        'your.key': 'Your English Text',
    },
    'zh-TW': {
        // 添加繁体中文翻译
        'your.key': '你的繁體中文文本',
    }
};
```

## 已有的翻译键

### 导航栏
- `nav.home` - 首页
- `nav.swap` - Swap
- `nav.pass` - Pass NFT
- `nav.tengine` - T-Engine
- `nav.gamefi` - GameFi
- `nav.connect` - 连接钱包

### Hero 区域
- `hero.badge` - 基于 Berachain 主网
- `hero.title` - Debear Party
- `hero.subtitle` - 下一代 Web3 潮流元宇宙游戏平台
- `hero.description` - 持有 Pass NFT，参与挖矿，赚取奖励
- `hero.learnmore` - 了解更多

### 功能展示
- `features.title` - 核心功能
- `features.subtitle` - 一站式 Web3 游戏生态系统
- `feature.pass.title` / `feature.pass.desc` - NFT Pass 系统
- `feature.tengine.title` / `feature.tengine.desc` - T-Engine 嬗变引擎
- `feature.invite.title` / `feature.invite.desc` - 邀请奖励系统
- `feature.dao.title` / `feature.dao.desc` - DAO治理与RWA资产
- `feature.security.title` / `feature.security.desc` - 安全可靠
- `feature.gamefi.title` / `feature.gamefi.desc` - GameFi与潮流元宇宙

### Roadmap
- `roadmap.title` - 发展路线图
- `roadmap.subtitle` - 我们的愿景与规划
- `roadmap.phase1.title` / `roadmap.phase1.desc` - 阶段1
- `roadmap.phase2.title` / `roadmap.phase2.desc` - 阶段2
- `roadmap.milestone.title` / `roadmap.milestone.desc` - 里程碑
- `roadmap.vision.title` / `roadmap.vision.desc` - 未来愿景

### Footer
- `footer.about.title` / `footer.about.desc` - 关于我们
- `footer.developer.title` - 开发者
- `footer.developer.whitepaper` - 白皮书
- `footer.developer.contract` - 智能合约
- `footer.developer.audit` - 审计报告
- `footer.developer.github` - GitHub
- `footer.developer.test` - 测试页面
- `footer.community.title` - 社区
- `footer.community.discord` - Discord
- `footer.community.twitter` - Twitter
- `footer.community.medium` - Medium
- `footer.community.help` - 帮助中心
- `footer.copyright` - 版权信息

### Toast 消息
- `toast.wallet.noProvider` - 请安装钱包
- `toast.wallet.switchNetwork` - 请切换网络
- `toast.wallet.connecting` - 连接中
- `toast.wallet.connected` - 连接成功
- `toast.wallet.failed` - 连接失败

### Loading
- `loading.default` - 加载中
- `loading.connecting` - 连接钱包中

### 语言选择器
- `lang.en` - English
- `lang.zh` - 繁體中文

## 待处理的页面

以下页面需要添加国际化支持：
- ⏳ **swap.html** - Swap 页面
- ⏳ **pass-nft.html** - Pass NFT 页面
- ⏳ **t-engine.html** - T-Engine 页面
- ⏳ **gamefi.html** - GameFi 页面
- ⏳ **whitepaper.html** - 白皮书页面
- ⏳ **admin.html** - 管理页面（如果需要）

## JavaScript API

### 切换语言
```javascript
// 切换到英文
window.i18n.setLanguage('en');

// 切换到繁体中文
window.i18n.setLanguage('zh-TW');
```

### 获取翻译文本
```javascript
// 基本用法
const text = window.i18n.t('nav.home');

// 带参数的翻译（未来扩展）
const text = window.i18n.t('welcome.message', { name: 'User' });
```

### 获取当前语言
```javascript
const currentLang = window.i18n.getCurrentLanguage();
console.log(currentLang); // 'en' 或 'zh-TW'
```

### 监听语言切换事件
```javascript
window.addEventListener('languageChanged', (event) => {
    console.log('Language changed to:', event.detail.lang);
    // 在这里执行需要的操作
});
```

## 样式说明

语言切换器的样式已经在 index.html 中定义，如果其他页面没有这些样式，需要复制以下 CSS 到页面：

```css
/* 语言切换器样式 */
.lang-switcher {
    position: relative;
    margin-right: var(--spacing-sm);
}

.lang-btn {
    padding: 8px 16px;
    background: rgba(0, 196, 239, 0.1);
    border: 2px solid rgba(0, 196, 239, 0.3);
    border-radius: 20px;
    color: var(--neon-cyan);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    min-width: 50px;
}

.lang-btn:hover {
    background: rgba(0, 196, 239, 0.2);
    border-color: var(--neon-cyan);
    box-shadow: 0 0 12px rgba(0, 196, 239, 0.4);
}

.lang-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: rgba(10, 14, 26, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(0, 196, 239, 0.3);
    border-radius: 12px;
    padding: 8px;
    min-width: 140px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s;
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(0, 196, 239, 0.2);
}

.lang-switcher:hover .lang-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.lang-option {
    padding: 10px 12px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s;
    color: var(--text-secondary);
    font-weight: 500;
}

.lang-option:hover {
    background: rgba(0, 196, 239, 0.1);
    color: var(--neon-cyan);
}

.lang-option.active {
    background: rgba(0, 196, 239, 0.15);
    color: var(--neon-cyan);
    font-weight: 600;
}

.nav-buttons {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}
```

## 注意事项

1. **默认文本**：HTML 中的默认文本应该使用英文，因为默认语言是英文
2. **HTML 标签**：如果翻译内容包含 HTML 标签（如 `<br>`），i18n 系统会自动使用 `innerHTML` 而不是 `textContent`
3. **属性翻译**：如果需要翻译 HTML 属性（如 `title`, `placeholder`），使用 `data-i18n-attr` 属性：
   ```html
   <input type="text" placeholder="Search" data-i18n="search.placeholder" data-i18n-attr="placeholder">
   ```
4. **动态内容**：通过 JavaScript 动态添加的内容会被 MutationObserver 自动检测并翻译

## 测试

1. 打开 index.html
2. 点击导航栏右侧的语言切换按钮（默认显示 "EN"）
3. 选择 "繁體中文"，页面内容应该切换到繁体中文
4. 刷新页面，语言设置应该保持
5. 连接钱包，Toast 消息应该使用选择的语言

## 扩展

如果需要添加更多语言（如简体中文），在 `js/i18n.js` 的 `translations` 对象中添加新的语言对象：

```javascript
const translations = {
    en: { /* ... */ },
    'zh-TW': { /* ... */ },
    'zh-CN': {
        'nav.home': '首页',
        // 添加所有翻译...
    }
};
```

然后在语言切换器中添加新选项。

---

**创建日期**: 2025-10-26  
**最后更新**: 2025-10-26
