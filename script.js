/**
 * HYBOX CORE ENGINE v.06
 * Visual: Resonance System
 * Developed: Muhammad Awais & Team
 */

// 1. SYSTEM INITIALIZATION & CREDENTIALS
const SB_URL = 'https://buelbnurnlrisrokmxir.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZWxibnVybmxyaXNyb2tteGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTg4NTUsImV4cCI6MjA4NTk3NDg1NX0.WdXiIMmRJtFQPdWEp_oIg9-LV2KJdJWPO3V9KWZUXOk';

let sb;
try {
    // Initializing Supabase client
    sb = supabase.createClient(SB_URL, SB_KEY);
    window.sb = sb; // Making it globally accessible to other files
} catch (e) {
    console.error("HYBOX_INIT_ERROR: Supabase failed to load.", e);
}

// 2. THEME & ENVIRONMENT PERSISTENCE
function toggleEnv() {
    const b = document.body;
    const current = b.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    b.setAttribute('data-theme', next);
    localStorage.setItem('hybox-theme', next);
}

// Applying saved theme on load
const savedTheme = localStorage.getItem('hybox-theme');
if (savedTheme) document.body.setAttribute('data-theme', savedTheme);

// 3. TEAM ARCHITECTURE (CAROUSEL SYNC)
async function syncTeam() {
    const carousel = document.getElementById('team-carousel');
    if (!carousel || !sb) return;

    try {
        const { data, error } = await sb
            .from('team_members')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            carousel.innerHTML = ''; // Clear skeleton
            data.forEach(member => {
                const card = document.createElement('div');
                card.className = 'team-card reveal';
                card.innerHTML = `
                    <img src="${member.img_url}" alt="${member.name}" class="team-avatar no-save">
                    <h3>${member.name}</h3>
                    <p style="opacity:0.5; font-size:0.75rem; font-weight:800; letter-spacing:1px; text-transform:uppercase;">${member.role}</p>
                `;
                carousel.appendChild(card);
            });
            // Re-init observer for new cards
            initRevealObserver();
        }
    } catch (err) {
        console.error('TEAM_SYNC_FAILURE:', err.message);
    }
}

// 4. FEATURED PRODUCTS (LANDING PAGE SYNC)
async function syncFeaturedProducts() {
    const grid = document.getElementById('preview-grid');
    if (!grid || !sb) return;

    try {
        const { data, error } = await sb
            .from('creations')
            .select('*')
            .limit(3)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            grid.innerHTML = ''; // Clear skeletons
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'preview-card reveal';
                card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(${item.logo_url})`;
                
                card.innerHTML = `
                    <div class="card-overlay">
                        <span style="font-size:0.6rem; font-weight:900; opacity:0.6; letter-spacing:2px; text-transform:uppercase;">${item.type}</span>
                        <h3>${item.title}</h3>
                        <p style="font-size:0.9rem; opacity:0.8; margin-top:5px;">${item.short_desc}</p>
                        <a href="lab.html" style="margin-top:20px; font-weight:900; text-decoration:underline; font-size:0.8rem;">VIEW PROJECT</a>
                    </div>
                `;
                grid.appendChild(card);
            });
            initRevealObserver();
        }
    } catch (err) {
        console.error('PRODUCT_SYNC_FAILURE:', err.message);
    }
}

// 5. CONTACT FORM (DATA TRANSMISSION)
async function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const btn = document.getElementById('submit-btn');

    if (!name || !email || !message) {
        alert('ALL FIELDS REQUIRED.');
        return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = "TRANSMITTING...";

    const apiUrl = 'https://backend-pico.onrender.com/aero/run/self-email-api?pk=v1-Z0FBQUFBQnBnUHhjZTVGZHVHd0E0alZybnpsbkpTaHpzd05nRmJWbFd4VGJaWWNsTG1SZzdrRzVFWjc4THFUVXRQT05wUElhdnYxd0lzcjVSckxPNnBua3lQQlotd0FfRFE9PQ==';

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: `HYBOX_DATA_LOG: ${name}`, 
                body: `ID: ${name}\nEMAIL: ${email}\nMESSAGE: ${message}` 
            })
        });
        const result = await res.json();
        if (result.status === 'success') {
            document.getElementById('successMessage').classList.remove('hidden');
            document.getElementById('contactForm').reset();
            btn.innerHTML = "SUCCESS";
            setTimeout(() => {
                document.getElementById('successMessage').classList.add('hidden');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 5000);
        }
    } catch (err) {
        alert('TRANSMISSION_FAILURE.');
        btn.innerHTML = "RETRY";
        btn.disabled = false;
    }
}

// 6. UI ANIMATIONS (REVEAL ON SCROLL)
function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 7. GLOBAL SECURITY
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

// 8. LIFECYCLE INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    // 1. Sync Theme
    const saved = localStorage.getItem('hybox-theme');
    if (saved) document.body.setAttribute('data-theme', saved);

    // 2. Load Data
    syncTeam();
    syncFeaturedProducts();

    // 3. Setup Scroll Reveal
    initRevealObserver();

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});