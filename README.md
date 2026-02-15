# FinAccord Advisory — Website

Fractional Finance Director & Enterprise Development services for African markets.

## Tech Stack
- Pure HTML/CSS/JS (no build step)
- Supabase free tier (booking system + portfolio)
- Google Fonts CDN
- WhatsApp deep links

## File Structure
```
index.html          - Main landing page
about.html          - About / credentials / proof of work
services.html       - Detailed services (8 services)
booking.html        - Consultation booking calendar
admin.html          - Admin dashboard (PIN: admin2026)
css/style.css       - Design system
js/supabase-config.js  - Supabase keys
js/i18n.js          - EN/FR translations
js/main.js          - Navigation, animations
js/booking.js       - Calendar engine
SUPABASE_SETUP.sql  - Run once in Supabase SQL Editor
```

## Deployment

### Hostinger (manual)
1. Download ZIP from GitHub
2. Upload to public_html/finaccount/
3. Extract and delete ZIP

### Hostinger Git Auto-Deploy
1. hPanel → Advanced → Git
2. Connect this repository
3. Set deploy path: public_html/finaccount
4. Auto-deploys on push to main

## Supabase Setup
1. Create project at supabase.com
2. Run SUPABASE_SETUP.sql in SQL Editor
3. Update keys in js/supabase-config.js
4. Change admin PIN in fd_settings table

## Offices
- London (HQ): 61 Bridge Street, HR5 3DJ
- New York: 445 Park Avenue
- Kinshasa: H2-1, av. Tombalbaye, C/Gombe
- Abuja: Coming Soon
- Accra: Coming Soon
- Kampala: Coming Soon
