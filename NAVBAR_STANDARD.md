# 导航栏统一标准 (基于 index.html)

## ✅ 已完成页面
- [x] index.html (标准模板)
- [x] pass-nft.html (已统一)
- [ ] t-engine.html (需要统一)
- [ ] swap.html (需要统一)
- [ ] gamefi.html (需要统一)

## 标准CSS样式

所有页面导航栏必须使用以下标准样式:

### 1. 导航栏基础样式
```css
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: var(--z-navbar);
    padding: var(--spacing-md) 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(10, 14, 26, 0.5);
    backdrop-filter: blur(20px);
    border-bottom: 2px solid rgba(0, 196, 239, 0.2);
    box-shadow: 0 4px 24px rgba(0, 196, 239, 0.06);
    transition: all 0.3s ease;
}
```

### 2. 语言切换器
- 使用 CSS 变量 (不使用硬编码值)
- opacity/visibility 方式显示下拉菜单
- 标准 padding: `8px 16px`
- 标准 margin-right: `var(--spacing-sm)`

### 3. 响应式设计 (@media max-width: 768px)
```css
.nav-menu { display: none; }
.hamburger { display: flex; }
.navbar .connect-btn { display: none; }
.mobile-connect-btn { display: block; }
```

### 4. z-index 层级使用CSS变量
- `--z-navbar`: 100
- `--z-mobile-menu-overlay`: 110  
- `--z-mobile-menu`: 120
- `--z-hamburger`: 130

## 标准HTML结构

```html
<nav class="navbar">
    <a href="index.html" class="logo">🐻 Debear Party</a>
    <ul class="nav-menu">
        <li><a href="index.html" data-i18n="nav.home">Home</a></li>
        <li><a href="swap.html" data-i18n="nav.swap">Swap</a></li>
        <li><a href="pass-nft.html" data-i18n="nav.pass">Pass NFT</a></li>
        <li><a href="t-engine.html" data-i18n="nav.tengine">T-Engine</a></li>
        <li><a href="gamefi.html" data-i18n="nav.gamefi">GameFi</a></li>
    </ul>
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
        <button class="hamburger" onclick="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>
```

## 移动端菜单标准结构

```html
<!-- 移动端菜单遮罩 -->
<div class="mobile-menu-overlay" onclick="toggleMobileMenu()"></div>

<!-- 移动端侧边栏菜单 -->
<div class="mobile-menu">
    <ul class="mobile-nav-links">
        <li><a href="index.html" data-i18n="nav.home">Home</a></li>
        <li><a href="swap.html" data-i18n="nav.swap">Swap</a></li>
        <li><a href="pass-nft.html" data-i18n="nav.pass">Pass NFT</a></li>
        <li><a href="t-engine.html" data-i18n="nav.tengine">T-Engine</a></li>
        <li><a href="gamefi.html" data-i18n="nav.gamefi">GameFi</a></li>
    </ul>
    <!-- 移动端语言选择 -->
    <div style="margin-top: 20px; padding: 10px 0; border-top: 1px solid rgba(0, 212, 255, 0.2);">
        <div class="lang-option" style="padding: 12px; cursor: pointer;" data-lang="en" onclick="window.i18n?.setLanguage('en')">
            <span data-i18n="lang.en">English</span>
        </div>
        <div class="lang-option" style="padding: 12px; cursor: pointer;" data-lang="zh-TW" onclick="window.i18n?.setLanguage('zh-TW')">
            <span data-i18n="lang.zh">繁體中文</span>
        </div>
    </div>
    <button class="connect-btn mobile-connect-btn" onclick="connectWallet()" data-i18n="nav.connect">Connect Wallet</button>
</div>
```

## 关键点

1. ✅ 所有z-index使用CSS变量
2. ✅ 所有spacing使用CSS变量
3. ✅ 语言切换器使用opacity+visibility而非display
4. ✅ 移动端隐藏`.navbar .connect-btn`和`.lang-switcher`
5. ✅ 汉堁菜单使用`toggleMobileMenu()`函数 (由common.js提供)
6. ✅ 连接钱包使用`connectWallet()`函数 (由common.js提供)

## 备用函数（防止common.js加载失败）

对于依赖其他JS文件的页面（如swap.html），建议在页内添加备用的 `toggleMobileMenu` 函数：

```javascript
// 备用移动端菜单切换函数（防止 common.js 未加载）
if (typeof toggleMobileMenu === 'undefined') {
    function toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (hamburger && mobileMenu && overlay) {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
}
```
