@echo off
chcp 65001 >nul
title EchoShadow 1314 - English Shadowing Assistant
echo ========================================================
echo   🎧 EchoShadow 1314 - 英文口說 Shadowing 智能跟讀學習系統
echo ========================================================
echo.
echo 正在啟動本地伺服器...
echo 請稍候，瀏覽器將自動開啟 http://localhost:8765
echo.

start "" "http://localhost:8765"
py -3 server.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 伺服器已退出或遇到錯誤。
    pause
)
