# Owner 文件夹整理完成

## ✅ 完成的操作

### 1. 创建 owner 文件夹
```
C:\Users\CDD\Desktop\newdp\owner\
```

### 2. 移动文件
- ✅ `admin.html` → `owner/admin.html`

### 3. 创建文档
- ✅ `owner/README.md` - 使用说明和安全指南
- ✅ `owner/.gitignore` - Git 忽略规则

### 4. 更新配置
- ✅ 更新根目录 `.gitignore` 忽略 owner 文件夹

## 📁 owner 文件夹结构

```
owner/
├── .gitignore          # 忽略 admin.html,只保留 README
├── README.md           # Owner 控制台说明文档
└── admin.html          # Owner 管理控制台 (不会提交到 Git)
```

## 🔒 安全配置

### Git 忽略设置

**根目录 .gitignore:**
```gitignore
# 管理员后台（敏感）
# admin.html 已移动到 owner/ 文件夹
owner/
admin*.html
```

**owner/.gitignore:**
```gitignore
# 忽略 owner 文件夹中的所有文件
*

# 除了这个 .gitignore 和 README.md
!.gitignore
!README.md
```

这样配置后:
- ✅ `admin.html` 不会被提交到 Git
- ✅ `owner/README.md` 会被提交 (说明文档)
- ✅ 其他开发者知道有 owner 文件夹,但看不到敏感内容

## 🌐 访问方式

### 本地开发
```
http://localhost:3000/owner/admin.html
```

### 生产环境部署
```
https://your-domain.com/owner/admin.html
```

**⚠️ 注意**: 
- 生产环境需要单独部署 admin.html
- 不要通过 Git 推送 admin.html
- 建议通过 FTP/SFTP 或其他安全方式上传

## 📋 admin.html 功能概览

### 核心功能
1. **矿池管理**
   - NFT 挖矿池余额和充值
   - T-Engine 池余额和充值

2. **紧急控制**
   - DPToken 暂停/恢复
   - DebearPass 暂停/恢复

3. **Pass 销售管理**
   - 设置价格
   - 控制销售开关

4. **NFT 挖矿配置**
   - 设置日产出
   - 配置税费

5. **T-Engine 配置**
   - 份额倍数
   - 释放率
   - 周期时长

## 🚀 部署建议

### 方案 1: 分离部署
```
公开网站: https://your-domain.com/
管理后台: https://admin.your-domain.com/
```

### 方案 2: 子目录 + 密码保护
```
公开网站: https://your-domain.com/
管理后台: https://your-domain.com/owner/ (需要 HTTP 认证)
```

### 方案 3: 本地访问
```
只在本地运行 admin.html
不部署到公网
通过 localhost 或内网访问
```

## 🔐 安全最佳实践

### 1. 访问控制
- [ ] 使用 HTTPS
- [ ] 配置 HTTP Basic Auth
- [ ] IP 白名单限制
- [ ] 防火墙规则

### 2. 代码安全
- [ ] 不在代码中硬编码私钥
- [ ] 所有敏感操作需要钱包签名
- [ ] 合约层面权限验证

### 3. 操作规范
- [ ] 记录所有管理操作
- [ ] 重要操作需要多人确认
- [ ] 定期备份配置
- [ ] 测试网验证后再操作主网

## 📝 下一步操作

### Git 操作
```bash
# 查看状态 (admin.html 应该不在列表中)
git status

# 添加 owner 文件夹 (只会添加 README.md)
git add owner/

# 提交
git commit -m "整理: 将 admin.html 移动到 owner 文件夹"

# 推送
git push origin main
```

### 部署操作
```bash
# 方式 1: 手动上传 admin.html
scp owner/admin.html user@server:/path/to/owner/

# 方式 2: 使用环境变量
export DEPLOY_ADMIN=true
./deploy.sh
```

## ⚠️ 重要提醒

1. **不要将 admin.html 提交到公开仓库**
   - 已通过 .gitignore 配置
   - 定期检查 git status 确认

2. **生产环境部署**
   - 单独通过安全方式上传
   - 配置访问限制
   - 记录访问日志

3. **Owner 私钥安全**
   - 使用硬件钱包
   - 多重签名
   - 定期轮换

## 📞 支持

如有问题,请检查:
1. `owner/README.md` - 详细使用说明
2. `.gitignore` - 确认配置正确
3. 控制台日志 - 查看错误信息

---

**整理完成时间**: 2025-10-29
**操作人员**: 开发团队
