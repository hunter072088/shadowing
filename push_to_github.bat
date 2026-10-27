@echo off
chcp 65001 >nul
title 上傳 EchoShadow 至 GitHub (專案: shadowing)
echo ========================================================
echo   🚀 EchoShadow 1314 - GitHub 專案同步工具
echo ========================================================
echo.
echo 目標儲存庫：https://github.com/hunter072088/shadowing.git
echo.

if not exist ".git" (
    echo [1/4] 初始化本機 Git 儲存庫...
    git init
    git branch -M main
) else (
    echo [1/4] 本機 Git 儲存庫已就緒。
)

echo [2/4] 加入所有專案檔案...
git add .

echo [3/4] 建立版本提交 (Commit)...
git commit -m "Initial commit: EchoShadow 1314 English Shadowing PWA"

echo [4/4] 設定遠端 GitHub 倉庫並推送...
git remote remove origin 2>nul
git remote add origin https://github.com/hunter072088/shadowing.git

echo.
echo 正在推送到 GitHub main 分支...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================================
    echo ⚠️ 推送可能需要建立 GitHub 遠端倉庫：
    echo 1. 請確認已在 GitHub 上建立名為 'shadowing' 的新倉庫
    echo    👉 https://github.com/new (Repository name 填寫: shadowing)
    echo 2. 建立完成後，再次雙擊執行此 push_to_github.bat 即可！
    echo ========================================================
) else (
    echo.
    echo 🎉 成功上傳到 GitHub: https://github.com/hunter072088/shadowing
)

echo.
pause
