# FinAccord Advisory — Deployment Guide

## File Structure (FLAT — no subfolders to move)
```
index.html          ← Main landing page
about.html          ← About / credentials page
services.html       ← Detailed services page
booking.html        ← Consultation booking calendar
admin.html          ← Admin dashboard (PIN: admin2026)
css/style.css       ← Design system
js/supabase-config.js  ← Supabase keys (ALREADY CONFIGURED)
js/i18n.js          ← EN/FR translations
js/main.js          ← Navigation, animations
js/booking.js       ← Calendar engine
SUPABASE_SETUP.sql  ← Run once in Supabase SQL Editor
```

## Hostinger Upload Steps
1. Go to hPanel → File Manager → public_html/finaccount/
2. Delete any old files in that folder
3. Upload finaccord-website.zip into that folder
4. Right-click the ZIP → Extract → extract to SAME folder
5. Delete the ZIP file after extraction
6. Visit finaccount.kashiskin.com — done!

## Supabase Setup (one time)
1. Go to supabase.com → your project → SQL Editor
2. Paste contents of SUPABASE_SETUP.sql → Run
3. Change admin PIN in Table Editor → fd_settings table

## Change Admin PIN
Default: admin2026
Go to: finaccount.kashiskin.com/admin.html
