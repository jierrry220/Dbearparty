// DP Price Tracker using Kodiak API
// 通过查询小额 BERA->DP swap 报价获取 DP 实时价格

class DPPriceKodiak {
    constructor(kodiakAPI) {
        this.kodiakAPI = kodiakAPI;
        
        // DP Token address on Berachain
        this.dpTokenAddress = '0xf7c464c7832e59855aa245ecc7677f54b3460e7d';
        
        // BERA native token address
        this.beraAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
        
        // 使用小额 BERA 查询价格（避免影响显示的价格）
        this.queryAmount = '0.01';
        
        // 价格缓存
        this.priceCache = {
            price: null,
            timestamp: 0,
            lastUpdate: null
        };
        
        // 自动刷新定时器
        this.refreshInterval = null;
        this.refreshRate = 10000; // 10秒
    }
    
    /**
     * 获取 DP 当前价格
     */
    async fetchPrice() {
        try {
            console.log('Fetching DP price from Kodiak...');
            
            // 请求 0.01 BERA -> DP 的报价
            const quoteData = await this.kodiakAPI.getQuote(
                this.beraAddress,
                this.dpTokenAddress,
                this.queryAmount,
                null,
                null,
                18
            );
            
            // 从报价中提取 DP 的美元价格
            const dpPriceUSD = parseFloat(quoteData.tokenOutPriceUSD || 0);
            
            if (dpPriceUSD > 0) {
                this.priceCache.price = dpPriceUSD;
                this.priceCache.timestamp = Date.now();
                this.priceCache.lastUpdate = new Date().toLocaleTimeString();
                
                console.log('DP Price updated:', dpPriceUSD);
                return dpPriceUSD;
            } else {
                throw new Error('Invalid price data from Kodiak');
            }
            
        } catch (error) {
            console.error('Failed to fetch DP price from Kodiak:', error);
            
            // 返回缓存的价格（如果有）
            if (this.priceCache.price) {
                console.warn('Using cached price');
                return this.priceCache.price;
            }
            
            throw error;
        }
    }
    
    /**
     * 获取缓存的价格
     */
    getCachedPrice() {
        return this.priceCache;
    }
    
    /**
     * 启动自动刷新
     */
    startAutoRefresh(callback) {
        // 立即获取一次价格
        this.fetchPrice().then(() => {
            if (callback) callback(this.priceCache);
        }).catch(err => {
            console.error('Initial price fetch failed:', err);
        });
        
        // 设置定时刷新
        this.refreshInterval = setInterval(async () => {
            try {
                await this.fetchPrice();
                if (callback) callback(this.priceCache);
            } catch (error) {
                console.error('Auto refresh failed:', error);
            }
        }, this.refreshRate);
        
        console.log(`Auto refresh started (every ${this.refreshRate / 1000}s)`);
    }
    
    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('Auto refresh stopped');
        }
    }
    
    /**
     * 格式化价格显示
     */
    formatPrice(price) {
        if (price >= 1) {
            return price.toFixed(4);
        } else if (price >= 0.01) {
            return price.toFixed(6);
        } else if (price >= 0.0001) {
            return price.toFixed(8);
        } else {
            return price.toExponential(4);
        }
    }
}

// 导出
window.DPPriceKodiak = DPPriceKodiak;
