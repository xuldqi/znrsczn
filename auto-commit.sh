#!/bin/bash

# 自动提交脚本 - 每次修改后运行此脚本会自动提交到GitHub

cd "$(dirname "$0")"

echo "正在检查Git状态..."
git status

echo "添加所有更改..."
git add .

echo "请输入提交信息（按回车使用默认信息）:"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "提交更改..."
git commit -m "$commit_message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "推送到GitHub..."
git push origin master

echo "✅ 完成！所有更改已安全上传到GitHub"