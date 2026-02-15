# 🚀 Automatic Deployment Setup Guide

This guide will help you set up automatic deployment from GitHub to your Hostinger server.

---

## ✅ Option 1: GitHub Actions (Recommended - Works for all Hostinger plans)

### Step 1: Get Your Hostinger FTP Credentials

1. Log into **Hostinger hPanel**
2. Go to **Files → FTP Accounts**
3. Note down:
   - **FTP Host**: (e.g., `ftp.yourdomain.com` or `ftp.kashiskin.com`)
   - **FTP Username**: Your FTP username
   - **FTP Password**: Your FTP password
   - **FTP Port**: Usually 21

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/kfrem/FinAccord-Website
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these three secrets:

   **Secret 1:**
   - Name: `FTP_SERVER`
   - Value: Your FTP host (e.g., `ftp.kashiskin.com`)

   **Secret 2:**
   - Name: `FTP_USERNAME`
   - Value: Your FTP username

   **Secret 3:**
   - Name: `FTP_PASSWORD`
   - Value: Your FTP password

### Step 3: That's It! ✅

The workflow file is already created at `.github/workflows/deploy-to-hostinger.yml`.

Once you add the secrets, **every push to the `main` branch will automatically deploy to your Hostinger server!**

### Testing the Deployment:

1. Make any small change to a file
2. Commit and push to `main` branch
3. Go to GitHub → **Actions** tab
4. Watch the deployment progress
5. Check your website: https://finaccount.kashiskin.com

---

## ✅ Option 2: Hostinger Git Integration (Easiest - if available on your plan)

### Step 1: Check if Available

1. Log into **Hostinger hPanel**
2. Look for **"Git Version Control"** or **"Advanced" → "Git"** in the sidebar

### Step 2: If Available:

1. Click **"Create/Connect Repository"** or **"Use existing repository"**
2. Choose **"Connect to GitHub"**
3. Repository URL: `https://github.com/kfrem/FinAccord-Website.git`
4. Branch: `main`
5. Deploy Path: `public_html/finaccount/`
6. Enable **"Automatic deployment on push"**
7. Save

### That's It! ✅

Now every push to `main` will automatically deploy!

---

## ✅ Option 3: PHP Webhook (Advanced - requires Git installed on server)

### Prerequisites:

- Git must be installed on your Hostinger server
- SSH access recommended (but not required)

### Step 1: Initialize Git on Server

Via SSH or File Manager terminal:
```bash
cd public_html/finaccount/
git init
git remote add origin https://github.com/kfrem/FinAccord-Website.git
git fetch origin main
git checkout main
```

### Step 2: Upload deploy-webhook.php

1. Upload `deploy-webhook.php` to `public_html/finaccount/`
2. Edit the file and set a strong secret key:
   ```php
   define('SECRET_KEY', 'your-random-secret-key-here');
   ```

### Step 3: Create GitHub Webhook

1. Go to GitHub: https://github.com/kfrem/FinAccord-Website/settings/hooks
2. Click **"Add webhook"**
3. **Payload URL**: `https://finaccount.kashiskin.com/deploy-webhook.php`
4. **Content type**: `application/json`
5. **Secret**: Use the same secret key from Step 2
6. **Events**: Select "Just the push event"
7. Click **"Add webhook"**

### Step 4: Test

1. Make a small change and push to `main`
2. Check `deploy.log` file on your server for deployment status

---

## 🎯 Which Option Should You Choose?

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **GitHub Actions** | Works everywhere, reliable, shows status | Requires FTP credentials | Most users |
| **Hostinger Git** | Easiest, no setup needed | Only on certain plans | If available |
| **PHP Webhook** | Free, customizable | Requires Git on server | Advanced users |

---

## 📝 Current Status

- ✅ GitHub Actions workflow file created (`.github/workflows/deploy-to-hostinger.yml`)
- ✅ PHP webhook script created (`deploy-webhook.php`)
- ⏳ Waiting for you to add FTP credentials or set up Hostinger Git integration

---

## 🆘 Need Help?

If you encounter any issues:

1. Check GitHub Actions tab for error messages
2. Verify FTP credentials are correct
3. Make sure server path is correct: `public_html/finaccount/`
4. Check deployment logs

---

## 🚀 Quick Start (Recommended)

**For fastest setup, use GitHub Actions:**

1. Get FTP credentials from Hostinger hPanel
2. Add three secrets to GitHub (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
3. Push this commit to trigger first deployment
4. Done! Future pushes will auto-deploy

Let me know if you need help with any step!
