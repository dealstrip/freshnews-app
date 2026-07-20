@echo off
cd /d "D:\WEBSITES\FRESHNEWS"
:loop
echo ========================================================
echo Fetching news feeds at %time%...
echo ========================================================
node fetch_news.js
git add www/feeds/*.json
git diff --staged --quiet
if %ERRORLEVEL% equ 0 (
    echo No new news to commit.
) else (
    echo Committing and pushing new news...
    git commit -m "Local auto-update news feeds"
    git push
)
echo ========================================================
echo Waiting 180 seconds before next update...
timeout /t 180 /nobreak
goto loop
