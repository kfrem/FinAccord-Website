// ============================================================================
// FINACCORD ADVISORY — Main JavaScript
// Navigation, scroll animations, WhatsApp, toast notifications
// ============================================================================

// --- Mobile Navigation ---
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    nav.classList.toggle('active');
}

// Close mobile nav on link click
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav__mobile a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileNav').classList.remove('active');
        });
    });
});

// --- Scroll Animations (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-up, .stagger').forEach(el => {
        observer.observe(el);
    });
});

// --- Nav scroll effect ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(11, 20, 38, 0.98)';
        } else {
            nav.style.background = 'rgba(11, 20, 38, 0.95)';
        }
    }
});

// --- WhatsApp ---
function openWhatsApp(message) {
    const num = SITE_CONFIG.whatsapp.replace(/\D/g, '');
    const msg = message || 'Hello FinAccord Advisory, I\'m interested in your Fractional Finance Director services. I\'d like to discuss my business needs.';
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- Toast Notifications ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- ICS Calendar Download ---
function downloadICS(date, time, service, name) {
    const startDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 min session
    const now = new Date();

    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//FinAccordAdvisory//Consultation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:consult-${now.getTime()}@finaccord.com`,
        `DTSTAMP:${fmt(now)}`,
        `DTSTART:${fmt(startDate)}`,
        `DTEND:${fmt(endDate)}`,
        `SUMMARY:FinAccord Strategy Session - ${name || 'Consultation'}`,
        `DESCRIPTION:Free 30-minute strategy session with FinAccord Advisory. We will assess your financial structure and identify quick wins.`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'finaccord-strategy-session.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- Smooth scroll for anchor links ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// --- Input sanitization ---
function sanitize(str) {
    if (!str) return '';
    return str.replace(/[<>\"\'`]/g, '').trim();
}

function sanitizePhone(str) {
    return str.replace(/[^\d+\s()-]/g, '').trim();
}

console.log('%c FinAccord Advisory ', 'background: #0B1426; color: #C8A054; font-size: 14px; padding: 8px 16px; border-radius: 4px; font-weight: bold;');
console.log('Strategic Financial Leadership for Africa\'s Growth Companies');
