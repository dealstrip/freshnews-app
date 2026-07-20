@echo off
cd /d "D:\WEBSITES\FRESHNEWS"
:loop
cls
echo ========================================================
echo FRESHNEWS AUTO UPDATER
echo Fetching live news feeds at %time%...
echo ========================================================
echo.

node fetch_news.js

echo.
echo ========================================================
echo Checking for changes...
git add www/feeds/*.json
git diff --staged --quiet
if %ERRORLEVEL% equ 0 (
    echo No new news to commit.
) else (
    echo Committing and pushing new news...
    git commit -m "Local auto-update news feeds"
    git push
)

echo.
echo ========================================================
echo Update complete! 
echo The script will now wait 3 minutes (180 seconds).
echo A countdown timer is shown below.
echo Do not close this window!
echo ========================================================
timeout /t 180 /nobreak

goto loop
