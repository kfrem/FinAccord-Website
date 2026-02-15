# Hostinger Automatic Deployment Options

## Option 1: GitHub Actions (Automated FTP Deploy)

### What you need:
1. Hostinger FTP credentials:
   - FTP Host (usually: ftp.yourdomain.com or provided by Hostinger)
   - FTP Username
   - FTP Password
   - Server Path: public_html/finaccount/

### Setup Steps:
I can create a GitHub Actions workflow that will:
- Automatically trigger on every push to main branch
- Upload all files to your Hostinger server via FTP
- Only upload changed files (efficient)
- Show deployment status in GitHub

---

## Option 2: Hostinger Git Version Control (Built-in)

### Check if available:
1. Log into Hostinger hPanel
2. Look for "Git Version Control" or "GitHub Integration" in the menu
3. If available, you can link your GitHub repo directly

### Setup in Hostinger:
1. Go to: Advanced → Git Version Control
2. Click "Create new repository" or "Connect to GitHub"
3. Enter: https://github.com/kfrem/FinAccord-Website.git
4. Set branch: main
5. Set path: public_html/finaccount/
6. Enable "Auto-deploy on push"

---

## Option 3: Webhook Deployment

### Setup:
1. Create a deploy.php script on your server
2. Add a GitHub webhook that triggers on push
3. The script pulls latest changes from GitHub

---

## Which option do you prefer?

**Option 1 (GitHub Actions)** is the most reliable and works on all Hostinger plans.
**Option 2** is easiest but only available on certain Hostinger plans.
**Option 3** requires custom scripting.

Let me know which credentials you can provide, and I'll set it up for you!
