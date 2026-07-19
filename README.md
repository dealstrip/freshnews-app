# FreshNews — Free Malayalam Brief News Client

FreshNews is a 100% database-free, serverless, brief news client modeled after premium aggregator apps. It reads verified RSS feeds from major news outlets (Malayalam, English, Hindi), parses and formats the articles, and serves them via CDN-cached static JSON files, keeping hosting costs at **$0.00** regardless of the number of users or downloads.

---

## ⚡ Tech Stack & Architecture
* **Frontend:** Single Page Web App built with Vanilla HTML5, CSS3, and JavaScript.
* **Native Wrap:** Integratable with **Capacitor.js** or **Apache Cordova** to compile into a native `.apk` for Android.
* **Database:** Static JSON files cached on a global CDN.
* **Scraper Engine:** A Node.js background parser run via scheduled **GitHub Actions** cron jobs.
* **AI Summaries:** Optionally uses the **Mistral API** to generate news summaries.
* **Free Hosting:** Hosted on **Cloudflare Pages** or **GitHub Pages** (Unlimited free bandwidth & requests).

---

## 🚀 How to Run Locally

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment (Optional for AI Summaries)
Create or update the `.env` file in the root directory:
```env
MISTRAL_API_KEY="YOUR_KEY_HERE"
```
*Note: If no valid key is provided, the script will fall back to using and cleaning the original RSS feed description.*

### 3. Fetch News Feeds
To trigger a manual feed update and generate the latest static JSON files in `./feeds/`:
```bash
npm run fetch
```

### 4. Run the Dev Server
To spin up a local development web server:
```bash
npm start
```
Open your browser and navigate to `http://localhost:3000`.

---

## ☁️ Deployment Guide (100% Free)

### Deploying the Web Client (Cloudflare Pages)
1. Commit and push this project to a new **public** repository on GitHub.
2. Sign in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
3. Click **Create Application** -> **Pages** -> **Connect to Git** and authorize your repo.
4. Set build settings:
   * **Framework Preset:** None
   * **Build Command:** `npm install` (No build steps needed, static folders)
   * **Output Directory:** `.` (root directory)
5. Save and deploy. Cloudflare will give you a free `https://your-app.pages.dev` subdomain and provide unlimited requests/bandwidth with zero charges.

### Scheduling the Feed Updates (GitHub Actions)
The file `.github/workflows/update_news.yml` in this repository is pre-configured to run every 30 minutes. To activate:
1. Push your repository to GitHub.
2. Go to your repository settings -> **Secrets and variables** -> **Actions**.
3. If using AI summaries, add a repository secret named `MISTRAL_API_KEY` with your API key.
4. The workflow will automatically run every 30 minutes, scrape the latest news, commit it back to the repo, and Cloudflare Pages will automatically pull and deploy the updated news files.
