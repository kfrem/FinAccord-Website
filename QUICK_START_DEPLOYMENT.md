# 🚀 QUICK START: Automatic Deployment to Hostinger

## The Easiest Way (5 minutes):

### Option A: Check for Hostinger Git Integration First

1. Log into **Hostinger hPanel**
2. Look for **"Git Version Control"** in the menu
3. If you see it:
   - Click "Connect to GitHub"
   - URL: `https://github.com/kfrem/FinAccord-Website.git`
   - Branch: `main`
   - Path: `public_html/finaccount/`
   - Enable "Auto-deploy"
   - ✅ DONE! You're all set!

### Option B: GitHub Actions (If Git integration not available)

**You need from Hostinger:**
- FTP host (e.g., `ftp.kashiskin.com`)
- FTP username
- FTP password

**Setup:**

1. **Add GitHub Secrets** (2 min)
   - Go to: https://github.com/kfrem/FinAccord-Website/settings/secrets/actions
   - Add 3 secrets:
     - `FTP_SERVER` = your FTP host
     - `FTP_USERNAME` = your username  
     - `FTP_PASSWORD` = your password

2. **Add Workflow File** (2 min)
   - Go to: https://github.com/kfrem/FinAccord-Website
   - Click: "Add file" → "Create new file"
   - Name: `.github/workflows/deploy.yml`
   - Copy content from `GITHUB_ACTIONS_WORKFLOW.txt`
   - Commit to main branch

3. **Done!** ✅
   - Every push to `main` will now auto-deploy
   - Check progress in "Actions" tab

---

## 📍 Your Setup:

- **Website:** finaccount.kashiskin.com
- **Repository:** github.com/kfrem/FinAccord-Website
- **Deploy Path:** public_html/finaccount/

---

## ✅ After Setup:

To deploy new changes:
1. Make changes to files
2. Commit and push to `main`
3. Wait 2-3 minutes
4. Check your website - it's updated!

No manual uploads ever again! 🎉
