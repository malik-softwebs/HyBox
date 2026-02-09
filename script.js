/**
 * HYBOX CORE ENGINE // v.04_SOFT_UI
 * Credentials: buelbnurnlrisrokmxir.supabase.co
 */

// 1. Initialize Supabase Client
const SB_URL = 'https://buelbnurnlrisrokmxir.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZWxibnVybmxyaXNyb2tteGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTg4NTUsImV4cCI6MjA4NTk3NDg1NX0.WdXiIMmRJtFQPdWEp_oIg9-LV2KJdJWPO3V9KWZUXOk';
const sb = supabase.createClient(SB_URL, SB_KEY);
window.sb = sb; 

// 2. Environment Theme Toggle
function toggleEnv() {
    const b = document.body;
    const current = b.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    b.setAttribute('data-theme', next);
    localStorage.setItem('hybox-theme', next);
}

const savedTheme = localStorage.getItem('hybox-theme');
if (savedTheme) document.body.setAttribute('data-theme', savedTheme);

// 3. Image Security
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

document.querySelectorAll('.no-save').forEach(img => {
    img.setAttribute('draggable', false);
});

// 4. Team Synchronization (Soft UI Grid)
async function syncTeam() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    try {
        const { data, error } = await sb
            .from('team_members')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            grid.innerHTML = ''; // Clear skeleton
            data.forEach(member => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="visual-unit">
                        <img src="${member.img_url}" alt="${member.name}" class="no-save">
                    </div>
                    <h3>${member.name}</h3>
                    <p class="role">${member.role}</p>
                `;
                grid.appendChild(card);
            });
        }
    } catch (err) {
        console.error('TEAM_SYNC_ERROR:', err.message);
    }
}

// 5. Contact Form Submission
async function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('ALL DATA FIELDS REQUIRED.');
        return;
    }

    const sText = document.getElementById('submit-text');
    const subText = document.getElementById('submitting-text');
    const successMsg = document.getElementById('successMessage');
    
    sText.style.display = 'none';
    subText.style.display = 'inline';

    const apiUrl = 'https://backend-pico.onrender.com/aero/run/self-email-api?pk=v1-Z0FBQUFBQnBnUHhjZTVGZHVHd0E0alZybnpsbkpTaHpzd05nRmJWbFd4VGJaWWNsTG1SZzdrRzVFWjc4THFUVXRQT05wUElhdnYxd0lzcjVSckxPNnBua3lQQlotd0FfRFE9PQ==';

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: `HYBOX_INQUIRY: ${name}`, 
                body: `ID: ${name}\nEMAIL: ${email}\nMESSAGE: ${message}` 
            })
        });
        const result = await res.json();
        if (result.status === 'success') {
            successMsg.style.display = 'block';
            document.getElementById('contactForm').reset();
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }
    } catch (err) {
        alert('TRANSMISSION_FAILURE.');
    } finally {
        sText.style.display = 'inline';
        subText.style.display = 'none';
    }
}

// 6. Modal Logic (Global)
window.openModal = function(title, content) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    syncTeam();
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});