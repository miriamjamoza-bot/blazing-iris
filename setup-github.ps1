$env:Path = "C:\Program Files\Git\cmd;" + $env:Path

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: Blazing Iris anti-addiction app"

Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git repository is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create a new repository (e.g., blazing-iris)" -ForegroundColor White
Write-Host "3. Copy the repository URL" -ForegroundColor White
Write-Host "4. Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/blazing-iris.git" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "5. Go to Actions tab in GitHub" -ForegroundColor White
Write-Host "6. Wait for build to complete (about 3-5 minutes)" -ForegroundColor White
Write-Host "7. Download APK from Artifacts section" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
