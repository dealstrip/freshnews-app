@echo off
cd /d "%~dp0"
echo Fetching news feeds...
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
echo Done.
