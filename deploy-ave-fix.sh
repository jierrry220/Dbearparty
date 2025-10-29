#!/bin/bash

echo "=========================================="
echo "🚀 部署 Ave API CORS 修复"
echo "=========================================="

# 检查 Git 状态
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "✅ 发现未提交的更改"
else
    echo "⚠️  没有检测到更改"
fi

# 添加所有更改
echo ""
echo "📦 添加文件到 Git..."
git add api/ave-proxy.js
git add ave-api.js
git add swap.html
git add zeabur.json
git add AVE_API_CORS_FIX.md

# 提交
echo ""
echo "💾 提交更改..."
git commit -m "Fix: Add CORS proxy for Ave API

- 添加服务端代理 api/ave-proxy.js
- 修改 ave-api.js 支持代理模式
- 更新 swap.html 启用代理
- 添加 zeabur.json 配置
- 添加详细文档 AVE_API_CORS_FIX.md

解决 Zeabur 部署后 Ave API 价格无法获取的问题"

# 推送
echo ""
echo "🚀 推送到 GitHub..."
git push

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "📝 下一步："
echo "1. 等待 Zeabur 自动部署（通常 1-2 分钟）"
echo "2. 访问 https://your-app.zeabur.app/swap.html"
echo "3. 检查价格是否正常显示"
echo "4. 打开浏览器控制台查看日志"
echo ""
echo "❓ 如果仍然有问题："
echo "- 查看 AVE_API_CORS_FIX.md 故障排查部分"
echo "- 检查 Zeabur Dashboard 的日志"
echo ""
