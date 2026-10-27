# EchoShadow 1314 PowerShell Launcher
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  🎧 EchoShadow 1314 - 英文口說 Shadowing 智能跟讀學習系統" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "正在啟動本地伺服器..." -ForegroundColor Green
Write-Host "開啟瀏覽器：http://localhost:8765" -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:8765"
py -3 server.py
