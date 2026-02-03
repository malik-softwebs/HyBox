// Environment Toggle
function toggleEnv() {
    const b = document.body;
    const current = b.getAttribute('data-theme');
    b.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

// RESTRICT IMAGE ACTIONS
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
}, false);

document.querySelectorAll('.no-save').forEach(img => {
    img.setAttribute('draggable', false);
});

// STAR RATING SYSTEM
const stars = document.querySelectorAll('.rating span');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = star.getAttribute('data-value');
        updateStars(currentRating);
    });
    star.addEventListener('mouseover', () => updateStars(star.getAttribute('data-value')));
    star.addEventListener('mouseleave', () => updateStars(currentRating));
});

function updateStars(val) {
    stars.forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-value') <= val);
    });
}

// FEEDBACK_LOG TRANSMISSION
function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message || currentRating === 0) {
        alert('ALL DATA FIELDS REQUIRED FOR LOGGING.');
        return;
    }

    const apiUrl = 'https://backend-pico.onrender.com/aero/run/self-email-api?pk=v1-Z0FBQUFBQnBnUHhjZTVGZHVHd0E0alZybnpsbkpTaHpzd05nRmJWbFd4VGJaWWNsTG1SZzdrRzVFWjc4THFUVXRQT05wUElhdnYxd0lzcjVSckxPNnBua3lQQlotd0FfRFE9PQ==';
    
    document.getElementById('submit-text').style.display = 'none';
    document.getElementById('submitting-text').style.display = 'inline';

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            subject: `Feedback from ${name}`, 
            body: `ID: ${name}\nEmail: ${email}\nRating: ${currentRating}\nData: ${message}` 
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('feedbackForm').reset();
            currentRating = 0;
            updateStars(0);
        }
    })
    .finally(() => {
        document.getElementById('submit-text').style.display = 'inline';
        document.getElementById('submitting-text').style.display = 'none';
    });
}
