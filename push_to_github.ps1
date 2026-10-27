# PowerShell GitHub Push Script for Shadowing Project
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  🚀 EchoShadow 1314 - GitHub 專案同步工具" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "目標儲存庫：https://github.com/hunter072088/shadowing.git" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path ".git")) {
    Write-Host "[1/4] 初始化本機獨立 Git 儲存庫..." -ForegroundColor Cyan
    git init
    git branch -M main
} else {
    Write-Host "[1/4] 本機 Git 儲存庫已就緒。" -ForegroundColor Cyan
}

Write-Host "[2/4] 加入所有專案檔案..." -ForegroundColor Cyan
git add .

Write-Host "[3/4] 建立版本提交 (Commit)..." -ForegroundColor Cyan
git commit -m "Initial commit: EchoShadow 1314 English Shadowing PWA"

Write-Host "[4/4] 設定遠端 GitHub 倉庫並推送..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/hunter072088/shadowing.git

Write-Host ""
Write-Host "正在推送到 GitHub main 分支..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host "⚠️ 若尚未在 GitHub 上建立倉庫，請先前往建立：" -ForegroundColor Yellow
    Write-Host "👉 https://github.com/new (Repository name 填寫: shadowing)" -ForegroundColor White
    Write-Host "建立完成後，再次執行 .\push_to_github.ps1 即可成功推播！" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "🎉 成功上傳到 GitHub: https://github.com/hunter072088/shadowing" -ForegroundColor Green
}
