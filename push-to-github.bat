@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
git commit -m "Initial commit"
git branch -M main
echo.
echo ========================================
echo Git repository is ready!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub.com
echo 2. Copy the repository URL
echo 3. Run the following commands:
echo    git remote add origin YOUR_REPO_URL
echo    git push -u origin main
echo.
echo 4. Go to Actions tab in GitHub
echo 5. Wait for the build to complete
echo 6. Download the APK from Artifacts
echo ========================================
pause
