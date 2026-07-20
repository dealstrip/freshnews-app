# FreshNews – Free Brief News Client

FreshNews is a 100% database-free, serverless, brief news client modeled after premium aggregator apps. It reads verified RSS feeds from major news outlets, parses and formats the articles, and serves them via CDN-cached static JSON files, keeping hosting costs at **$0.00** regardless of the number of users or downloads.

---

## 🚀 Features & Architecture
* **Frontend:** Single Page Web App built with Vanilla HTML5, CSS3, and JavaScript.
* **Supported Languages:** Malayalam, English, Hindi, and Tamil.
* **Database:** Static JSON files cached on a global CDN (e.g. GitHub Pages or Cloudflare Pages).
* **Deterministic Share Links:** Every news article generates a unique 5-character short ID based on an MD5 hash of its original URL (e.g., `?lang=english&id=a4f9d`). This ensures share links are permanently valid and extremely clean.
* **Persistent User Preferences:** The app remembers the user's last browsed language automatically across sessions, as well as their Light/Dark mode preferences, via `localStorage`.

---

## 🛠️ How the News Engine Works

The backend script `fetch_news.js` is responsible for parsing live news. 

**Logic Flow:**
1. It loops through **all** configured RSS feeds for each language (10+ feeds per language).
2. It deduplicates articles that might have the exact same title.
3. It aggregates every single article published across all feeds into a giant list.
4. It sorts the entire list down to the exact second of publication.
5. It limits the final output to the **Top 100 absolute newest** articles across all sources to guarantee maximum freshness.
6. It saves this data into static JSON files (`www/feeds/malayalam.json`, etc.).

---

## ⏱️ Auto-Updating the News

Because GitHub Actions (cron jobs) are "best effort" and can often be delayed by 30+ minutes or canceled due to concurrent commits, we have bypassed them in favor of a **Local Windows Scheduled Task**.

On your local Windows machine (in `D:\WEBSITES\FRESHNEWS`), the automated update process runs silently in the background every 15 minutes.

### The Automation Scripts
* **`auto_updater.bat`**: The core script. It navigates to the project directory, runs `node fetch_news.js`, checks for new changes using `git diff`, and if changes exist, commits and pushes them to GitHub.
* **`auto_updater_hidden.vbs`**: A Visual Basic script wrapper that executes the `.bat` file invisibly. This prevents a black CMD window from flashing on your screen every 15 minutes.

### Setting up the Scheduled Task (If it needs to be recreated)
If you ever migrate to a new computer or need to recreate the background job, open **Command Prompt** (as Administrator) and run this exact command:

```cmd
schtasks /create /tn "FreshNews_AutoUpdater" /tr "wscript.exe D:\WEBSITES\FRESHNEWS\auto_updater_hidden.vbs" /sc minute /mo 15 /F
```

This ensures your PC will automatically pull, compile, and publish the latest news every 15 minutes to your live site, as long as it is turned on and connected to the internet.

---

## 💻 Manual Deployment & Development

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Manual Fetch
To trigger a manual feed update at any time and generate the latest static JSON files:
```bash
node fetch_news.js
```

### 3. Run Locally
To preview the site locally, you can use any static server or VS Code Live Server in the `www` folder.

### 4. GitHub Actions (Fallback)
The file `.github/workflows/update_news.yml` is still present in the repository as a fallback. If your local computer is turned off for an extended period, GitHub will attempt to fetch news every 15 minutes, though its schedule may be less reliable than your local task.
