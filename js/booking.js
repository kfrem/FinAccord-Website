// ============================================================================
// FINACCORD ADVISORY — Booking Calendar Engine
// No React, No Calendly, No paid APIs
// ============================================================================

// --- State ---
let calCurrentMonth = new Date().getMonth();
let calCurrentYear = new Date().getFullYear();
let selectedDate = null;
let selectedTime = null;
let takenTimes = [];
let blockedDates = [];
let confirmedBooking = null;

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = SITE_CONFIG.booking.defaultHours;

function generateTimeSlots() {
    const slots = [];
    for (let h = HOURS.open; h < HOURS.close; h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00`);
        if (h + 0.5 < HOURS.close) {
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }
    }
    return slots;
}

const TIME_SLOTS = generateTimeSlots();

document.addEventListener('DOMContentLoaded', () => {
    renderDayLabels();
    renderCalendar();
    loadBlockedDates();
});

function renderDayLabels() {
    const container = document.getElementById('calDayLabels');
    if (!container) return;
    container.innerHTML = DAY_LABELS.map(d => `<div class="cal-day-label">${d}</div>`).join('');
}

function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const monthYear = document.getElementById('calMonthYear');
    if (!grid || !monthYear) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    monthYear.textContent = `${months[calCurrentMonth]} ${calCurrentYear}`;

    const firstDay = new Date(calCurrentYear, calCurrentMonth, 1);
    const lastDay = new Date(calCurrentYear, calCurrentMonth + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + SITE_CONFIG.booking.daysAhead);

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    let html = '';

    for (let i = 0; i < startDay; i++) {
        html += '<button class="cal-date cal-date--empty" disabled></button>';
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(calCurrentYear, calCurrentMonth, day);
        const dateStr = formatDate(date);
        const isPast = date < today;
        const isTooFar = date > maxDate;
        const isBlocked = blockedDates.includes(dateStr);
        const isDisabled = isPast || isTooFar || isBlocked;
        const isToday = date.getTime() === today.getTime();
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

        let classes = 'cal-date';
        if (isDisabled) classes += ' cal-date--disabled';
        if (isToday) classes += ' cal-date--today';
        if (isSelected) classes += ' cal-date--selected';

        html += `<button class="${classes}" ${isDisabled ? 'disabled' : ''} onclick="selectDate(${calCurrentYear}, ${calCurrentMonth}, ${day})">${day}</button>`;
    }

    grid.innerHTML = html;
}

function calNav(direction) {
    calCurrentMonth += direction;
    if (calCurrentMonth > 11) { calCurrentMonth = 0; calCurrentYear++; }
    else if (calCurrentMonth < 0) { calCurrentMonth = 11; calCurrentYear--; }
    renderCalendar();
}

function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    selectedTime = null;
    renderCalendar();
    showTimeSlots();
    fetchAvailability();
    updateFormVisibility();
}

function showTimeSlots() {
    const section = document.getElementById('timeSection');
    if (!section) return;
    section.style.display = 'block';
    renderTimeSlots();
}

function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    if (!container) return;

    container.innerHTML = TIME_SLOTS.map(time => {
        const isTaken = takenTimes.includes(time);
        const isSelected = selectedTime === time;
        let classes = 'time-slot';
        if (isTaken) classes += ' time-slot--taken';
        if (isSelected) classes += ' time-slot--selected';
        return `<button class="${classes}" ${isTaken ? 'disabled' : ''} onclick="selectTime('${time}')">${time}</button>`;
    }).join('');
}

function selectTime(time) {
    selectedTime = time;
    renderTimeSlots();
    updateFormVisibility();
    updateSlotDisplay();
}

async function fetchAvailability() {
    if (!selectedDate) return;
    const loading = document.getElementById('timeLoading');
    if (loading) loading.style.display = 'inline';
    takenTimes = [];
    try {
        const startOfDay = new Date(selectedDate); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate); endOfDay.setHours(23, 59, 59, 999);
        if (!supabase) throw new Error("No DB");
        const { data, error } = await supabase.from(DB.consultations).select('consultation_time')
            .gte('consultation_time', startOfDay.toISOString()).lte('consultation_time', endOfDay.toISOString()).neq('status', 'cancelled');
        if (data) {
            takenTimes = data.map(app => {
                const d = new Date(app.consultation_time);
                return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
            });
        }
    } catch (err) { console.warn('Demo mode:', err.message); }
    if (loading) loading.style.display = 'none';
    renderTimeSlots();
}

async function loadBlockedDates() {
    try {
        if (!supabase) throw new Error("No DB");
        const { data } = await supabase.from(DB.blocked_slots).select('blocked_date');
        if (data) { blockedDates = data.map(d => d.blocked_date); renderCalendar(); }
    } catch (err) { console.warn('Blocked dates not loaded (demo mode).'); }
}

function updateFormVisibility() {
    const placeholder = document.getElementById('formPlaceholder');
    const form = document.getElementById('consultationForm');
    if (selectedTime) {
        if (placeholder) placeholder.style.display = 'none';
        if (form) form.style.display = 'block';
    } else {
        if (placeholder) placeholder.style.display = 'flex';
        if (form) form.style.display = 'none';
    }
}

function updateSlotDisplay() {
    const display = document.getElementById('selectedSlotDisplay');
    if (display && selectedDate && selectedTime) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        display.textContent = `${selectedDate.toLocaleDateString('en-US', options)} at ${selectedTime}`;
    }
}

async function submitBooking(e) {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('submitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner" style="display:inline-block;width:16px;height:16px;margin-right:8px;vertical-align:middle;"></span> Confirming...'; }

    const formData = new FormData(form);
    const company = sanitize(formData.get('company'));
    const contact = sanitize(formData.get('contact_name'));
    const email = sanitize(formData.get('email'));
    const phone = sanitizePhone(formData.get('phone'));
    const industry = formData.get('industry');
    const timezone = formData.get('timezone');
    const painPoints = sanitize(formData.get('pain_points'));
    const whatsappConfirm = formData.get('whatsapp_confirm') === 'on';

    if (!company || !contact || !email || !phone || !industry || !timezone) {
        showToast('Please fill in all required fields.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm Booking'; }
        return;
    }
    if (!selectedDate || !selectedTime) {
        showToast('Please select a date and time.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm Booking'; }
        return;
    }

    const bookingDate = new Date(selectedDate);
    const [hours, mins] = selectedTime.split(':').map(Number);
    bookingDate.setHours(hours, mins, 0, 0);

    const bookingData = {
        company_name: company, contact_name: contact, contact_email: email,
        contact_phone: phone, industry: industry, timezone: timezone,
        pain_points: painPoints, consultation_time: bookingDate.toISOString(),
        status: 'pending', whatsapp_confirm: whatsappConfirm,
        notes: `Industry: ${industry} | TZ: ${timezone} | WhatsApp: ${whatsappConfirm}`,
        created_at: new Date().toISOString()
    };

    try {
        if (!supabase) throw new Error("No DB");
        const { data, error } = await supabase.from(DB.consultations).insert(bookingData);
        if (error) throw error;
        confirmedBooking = { ...bookingData, dateFormatted: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), time: selectedTime };
        showSuccessScreen();
        showToast('Booking confirmed! We\'ll be in touch soon.', 'success');
        if (whatsappConfirm) { setTimeout(() => sendBookingWhatsApp(), 1500); }
    } catch (err) {
        confirmedBooking = { ...bookingData, dateFormatted: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), time: selectedTime };
        showSuccessScreen();
        showToast('Demo mode: Booking would be saved. Connect Supabase for full functionality.', 'info');
    }
}

function showSuccessScreen() {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
    const summary = document.getElementById('bookingSummary');
    if (summary && confirmedBooking) {
        summary.innerHTML = `<strong>${confirmedBooking.company_name}</strong><br>${confirmedBooking.dateFormatted} at ${confirmedBooking.time}<br><span style="font-size:0.88rem;color:var(--gray-500);">Contact: ${confirmedBooking.contact_name} &bull; ${confirmedBooking.contact_email}</span>`;
    }
    document.getElementById('bookingSuccess').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetBooking() {
    selectedDate = null; selectedTime = null; confirmedBooking = null; takenTimes = [];
    document.getElementById('bookingSuccess').style.display = 'none';
    document.getElementById('bookingForm').style.display = 'grid';
    document.getElementById('consultationForm').reset();
    document.getElementById('timeSection').style.display = 'none';
    updateFormVisibility(); renderCalendar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadBookingICS() {
    if (!confirmedBooking) return;
    downloadICS(selectedDate || new Date(confirmedBooking.consultation_time), confirmedBooking.time, 'FinAccord Strategy Session', confirmedBooking.contact_name);
}

function sendBookingWhatsApp() {
    if (!confirmedBooking) { openWhatsApp(); return; }
    const msg = `Hello FinAccord Advisory,\n\nI've booked a strategy session:\n\n` +
        `📅 ${confirmedBooking.dateFormatted} at ${confirmedBooking.time}\n` +
        `🏢 ${confirmedBooking.company_name}\n👤 ${confirmedBooking.contact_name}\n` +
        `📧 ${confirmedBooking.contact_email}\n📱 ${confirmedBooking.contact_phone}\n` +
        `🏭 Industry: ${confirmedBooking.industry}\n🌍 Timezone: ${confirmedBooking.timezone}\n` +
        (confirmedBooking.pain_points ? `\n💬 Challenge: ${confirmedBooking.pain_points}\n` : '') +
        `\nLooking forward to our session!`;
    openWhatsApp(msg);
}

function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}
