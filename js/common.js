/**
 * Debear Party - 公共JavaScript文件
 * 包含：钱包连接、移动端菜单、Toast提示、Loading、粒子效果等
 */

// ========================================
// 全局配置
// ========================================
const CONFIG = {
    BERACHAIN_CHAIN_ID: '0x138de', // 80094 in hex
    BERACHAIN_CHAIN_ID_DECIMAL: 80094,
    OWNER_ADDRESS: '0xd8B4286c2f299220830f7228bab15225b4EA8379', // Owner 地址（可选）
    PARTICLES_CONFIG: {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: ['#00c4ef', '#e900e9', '#4dd0e1', '#d91e5a'] },
            shape: { type: 'circle' },
            opacity: { 
                value: 0.6, 
                random: true, 
                anim: { enable: true, speed: 1, opacity_min: 0.2 } 
            },
            size: { 
                value: 3, 
                random: true, 
                anim: { enable: true, speed: 3, size_min: 0.5 } 
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00c4ef',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' }
            },
            modes: {
                grab: { distance: 200, line_linked: { opacity: 0.8 } },
                push: { particles_nb: 4 }
            }
        }
    }
};

// ========================================
// Toast 提示系统
// ========================================
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // 创建toast容器
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // 添加图标
        const icon = this.getIcon(type);
        toast.innerHTML = `${icon}<span>${message}</span>`;
        
        this.container.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    this.container.removeChild(toast);
                }
            }, 300);
        }, duration);

        return toast;
    }

    getIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// 全局toast实例
const toast = new ToastManager();

// ========================================
// Loading 加载管理
// ========================================
class LoadingManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        if (!document.querySelector('.loading-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">加载中...</div>
            `;
            // 确保初始状态是隐藏的
            this.overlay.style.display = 'none';
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.querySelector('.loading-overlay');
            // 确保已存在的元素也是隐藏的
            this.overlay.classList.remove('active');
            this.overlay.style.display = 'none';
        }
    }

    show(text = '加载中...') {
        if (this.overlay) {
            const textEl = this.overlay.querySelector('.loading-text');
            if (textEl) {
                textEl.textContent = text;
            }
            this.overlay.style.display = 'flex';
            // 使用 setTimeout 确保 display 先生效
            setTimeout(() => {
                this.overlay.classList.add('active');
            }, 10);
            // 禁止页面滚动
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            // 等待动画结束后再隐藏
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 300);
            // 恢复页面滚动
            document.body.style.overflow = '';
        }
    }
}

// 全局loading实例
const loading = new LoadingManager();

// ========================================
// 钱包管理
// ========================================
class WalletManager {
    constructor() {
        this.provider = null;
        this.address = null;
        this.isConnected = false;
    }

    // 获取钱包提供者
    getProvider() {
        if (window.okxwallet) {
            return window.okxwallet;
        } else if (window.ethereum) {
            return window.ethereum;
        }
        return null;
    }

    // 连接钱包
    async connect() {
        try {
            this.provider = this.getProvider();
            
            if (!this.provider) {
                const msg = window.i18n ? window.i18n.t('toast.wallet.noProvider') : 'Please install MetaMask or OKX Wallet!';
                toast.error(msg);
                return null;
            }

            const loadingMsg = window.i18n ? window.i18n.t('loading.connecting') : 'Connecting wallet...';
            loading.show(loadingMsg);

            // 请求账户权限
            const accounts = await this.provider.request({ 
                method: 'eth_requestAccounts' 
            });

            // 检查并切换到Berachain网络
            const chainId = await this.provider.request({ method: 'eth_chainId' });
            if (chainId !== CONFIG.BERACHAIN_CHAIN_ID) {
                try {
                    await this.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: CONFIG.BERACHAIN_CHAIN_ID }]
                    });
                } catch (switchError) {
                    loading.hide();
                    const msg = window.i18n ? window.i18n.t('toast.wallet.switchNetwork') : 'Please switch to Berachain Mainnet (Chain ID: 80094)';
                    toast.error(msg);
                    return null;
                }
            }

            this.address = accounts[0];
            this.isConnected = true;

            // 保存连接状态
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletAddress', this.address);

            // 更新UI
            this.updateUI();

            // 检查Owner权限
            this.checkOwnerAccess();

            loading.hide();
            const successMsg = window.i18n ? window.i18n.t('toast.wallet.connected') : 'Wallet connected successfully!';
            toast.success(successMsg);

            return this.address;
        } catch (error) {
            loading.hide();
            console.error('Connect wallet error:', error);
            const errorMsg = window.i18n ? window.i18n.t('toast.wallet.failed') : 'Failed to connect wallet';
            toast.error(errorMsg + ': ' + error.message);
            return null;
        }
    }

    // 检查钱包连接状态
    async checkConnection() {
        const wasConnected = localStorage.getItem('walletConnected');
        if (!wasConnected) return false;

        try {
            this.provider = this.getProvider();
            if (!this.provider) return false;

            const accounts = await this.provider.request({ 
                method: 'eth_accounts' 
            });

            if (accounts && accounts.length > 0) {
                this.address = accounts[0];
                this.isConnected = true;
                localStorage.setItem('walletAddress', this.address);
                this.updateUI();
                this.checkOwnerAccess();
                return true;
            } else {
                // 钱包已断开
                this.disconnect();
                return false;
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
            return false;
        }
    }

    // 断开连接
    disconnect() {
        this.isConnected = false;
        this.address = null;
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
        this.updateUI();
    }

    // 更新UI显示
    updateUI() {
        const connectBtns = document.querySelectorAll('.connect-btn');
        
        if (this.isConnected && this.address) {
            const shortAddr = this.address.substring(0, 6) + '...' + this.address.substring(38);
            connectBtns.forEach(btn => {
                btn.textContent = shortAddr;
                btn.disabled = true;
            });
        } else {
            const btnText = window.i18n ? window.i18n.t('nav.connect') : 'Connect Wallet';
            connectBtns.forEach(btn => {
                btn.textContent = btnText;
                btn.disabled = false;
            });
        }
    }

    // 检查Owner权限
    checkOwnerAccess() {
        if (!this.address) return;
        
        // 安全检查: 如果没有配置 OWNER_ADDRESS，直接返回
        if (!CONFIG.OWNER_ADDRESS) return;

        const userAddress = this.address.toLowerCase();
        const ownerAddress = CONFIG.OWNER_ADDRESS.toLowerCase();

        const ownerLink = document.getElementById('owner-link');
        if (ownerLink) {
            ownerLink.style.display = userAddress === ownerAddress ? 'block' : 'none';
        }
    }

    // 获取当前地址
    getAddress() {
        return this.address;
    }

    // 监听账户变化
    onAccountsChanged(callback) {
        if (this.provider) {
            this.provider.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.address = accounts[0];
                    localStorage.setItem('walletAddress', this.address);
                    this.updateUI();
                    this.checkOwnerAccess();
                }
                if (callback) callback(accounts);
            });
        }
    }

    // 监听网络变化
    onChainChanged(callback) {
        if (this.provider) {
            this.provider.on('chainChanged', (chainId) => {
                // 重新加载页面
                window.location.reload();
                if (callback) callback(chainId);
            });
        }
    }
}

// 全局钱包实例
const wallet = new WalletManager();

// ========================================
// 移动端菜单管理
// ========================================
class MobileMenuManager {
    constructor() {
        this.hamburger = null;
        this.menu = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.hamburger = document.querySelector('.hamburger');
        this.menu = document.querySelector('.mobile-menu');
        this.overlay = document.querySelector('.mobile-menu-overlay');

        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggle());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // 点击菜单链接后自动关闭
        if (this.menu) {
            const links = this.menu.querySelectorAll('a, button');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    // 延迟关闭，让页面跳转先执行
                    setTimeout(() => this.close(), 100);
                });
            });
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.hamburger?.classList.add('active');
        this.menu?.classList.add('active');
        this.overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.hamburger?.classList.remove('active');
        this.menu?.classList.remove('active');
        this.overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// 导航栏滚动效果
// ========================================
class NavbarManager {
    constructor() {
        this.navbar = null;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.navbar = document.querySelector('.navbar');
        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
}

// ========================================
// 滚动动画观察器
// ========================================
class ScrollAnimationManager {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        // 观察所有fade-in元素
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }

    // 添加新元素到观察列表
    observe(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }
}

// ========================================
// 粒子背景初始化
// ========================================
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', CONFIG.PARTICLES_CONFIG);
    }
}

// ========================================
// 平滑滚动
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

// ========================================
// 全局连接钱包函数（向后兼容）
// ========================================
async function connectWallet() {
    return await wallet.connect();
}

// ========================================
// 移动端菜单切换函数（向后兼容）
// ========================================
function toggleMobileMenu() {
    if (window.mobileMenu) {
        window.mobileMenu.toggle();
    }
}

// ========================================
// 页面初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子背景
    initParticles();

    // 初始化移动端菜单
    window.mobileMenu = new MobileMenuManager();

    // 初始化导航栏
    window.navbar = new NavbarManager();

    // 初始化滚动动画
    window.scrollAnimation = new ScrollAnimationManager();

    // 初始化平滑滚动
    initSmoothScroll();

    // 检查钱包连接状态
    wallet.checkConnection();

    // 监听钱包事件
    wallet.onAccountsChanged();
    wallet.onChainChanged();
    
    // 监听语言切换事件，更新钱包按钮文本
    window.addEventListener('languageChanged', () => {
        wallet.updateUI();
    });
});

// ========================================
// 导出全局对象
// ========================================
window.DebearParty = {
    wallet,
    toast,
    loading,
    mobileMenu: null, // Will be set in DOMContentLoaded
    navbar: null,
    scrollAnimation: null,
    CONFIG
};
