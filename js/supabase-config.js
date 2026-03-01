// ============================================================================
// FINACCORD ADVISORY - Supabase Configuration
// ============================================================================

var SUPABASE_URL = 'https://qslohrsojkimdbylulzo.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_f54_FlsNX3jm9o6NHFu0jA_kUlwgRhf';

// Initialize Supabase ONLY if CDN is loaded (booking + admin pages)
var supabase = null;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.log('Supabase not loaded on this page.');
}

// Database table names
var DB = {
    consultations: 'fd_consultations',
    services: 'fd_services',
    blocked_slots: 'fd_blocked_slots',
    settings: 'fd_settings',
    inquiries: 'fd_inquiries'
};

// Business Configuration
var SITE_CONFIG = {
    name: 'FinAccord Advisory',
    tagline: "Strategic Financial Leadership for Africa's Growth Companies",
    email: 'advisory@finaccord.com',
    whatsapp: '447939823988',
    addresses: {
        uk: { label: 'United Kingdom (HQ)', line1: '61 Bridge Street', line2: 'HR5 3DJ, United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
        us: { label: 'United States', line1: '445 Park Avenue', line2: 'New York, NY', flag: '\u{1F1FA}\u{1F1F8}' },
        nigeria: { label: 'Nigeria', line1: 'Abuja', line2: 'Coming Soon', flag: '\u{1F1F3}\u{1F1EC}' },
        congo: { label: 'Congo (DRC)', line1: 'H2-1, av. TOMBALBAYE', line2: 'C/Gombe, V/Kinshasa', flag: '\u{1F1E8}\u{1F1E9}' },
        ghana: { label: 'Ghana', line1: 'Accra', line2: 'Coming Soon', flag: '\u{1F1EC}\u{1F1ED}' },
        uganda: { label: 'Uganda', line1: 'Kampala', line2: 'Coming Soon', flag: '\u{1F1FA}\u{1F1EC}' }
    },
    markets: [
        { name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', lang: 'en' },
        { name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}', lang: 'en' },
        { name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}', lang: 'en' },
        { name: 'Congo (DRC)', flag: '\u{1F1E8}\u{1F1E9}', lang: 'fr' },
        { name: 'Zambia', flag: '\u{1F1FF}\u{1F1F2}', lang: 'en' },
        { name: 'Senegal', flag: '\u{1F1F8}\u{1F1F3}', lang: 'fr' }
    ],
    booking: {
        slotInterval: 60,
        daysAhead: 21,
        defaultHours: { open: 7, close: 21 }
    }
};
