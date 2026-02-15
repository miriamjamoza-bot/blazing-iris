$env:Path = "C:\Program Files\Git\cmd;" + $env:Path

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Blazing Iris - GitHub Push Script" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Step 2: Committing changes..." -ForegroundColor Yellow
git add -A
git commit -m "Initial commit: Blazing Iris app" 2>$null
git branch -M main 2>$null

Write-Host ""
Write-Host "Step 3: Setting up remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/miriamjamoza-bot/blazing-iris.git

Write-Host ""
Write-Host "Step 4: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may need to login to GitHub." -ForegroundColor Magenta
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Done! Now:" -ForegroundColor Green
Write-Host "1. Go to: https://github.com/miriamjamoza-bot/blazing-iris/actions" -ForegroundColor White
Write-Host "2. Wait for build to complete (3-5 min)" -ForegroundColor White
Write-Host "3. Download APK from Artifacts" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
