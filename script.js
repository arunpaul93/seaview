// Smooth scrolling for navigation links - but not on page load
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Only allow manual navigation after page has loaded
        setTimeout(() => {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Re-enable smooth scrolling for manual navigation
                document.documentElement.style.scrollBehavior = 'smooth';
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    });
});

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Gallery modal functionality
function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalImg.alt = img.alt;
}

// Close modal when clicking the X or outside the image
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'none';
});

document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('imageModal')) {
        document.getElementById('imageModal').style.display = 'none';
    }
});

// Hero background image cycling
const heroImages = [
    'seaview (1).jpeg',
    'seaview (2).jpeg',
    'seaview (3).jpeg',
    'seaview (4).jpeg'
];

let currentImageIndex = 0;
const heroSection = document.querySelector('.hero');

function changeHeroBackground() {
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    const currentImage = heroImages[currentImageIndex];
    
    heroSection.style.transition = 'background-image 1s ease-in-out';
    heroSection.style.backgroundImage = `linear-gradient(rgba(44, 90, 160, 0.7), rgba(44, 90, 160, 0.7)), url('${currentImage}')`;
}

// Change hero background every 8 seconds
setInterval(changeHeroBackground, 8000);

// Form validation and submission (only if form exists on the page)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => { formObject[key] = value; });
        if (!validateForm(formObject)) return;

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        try {
            await sendEmail(formObject);
            showMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
            removeValidationClasses();
        } catch (error) {
            showMessage('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm(data) {
    let isValid = true;
    removeValidationClasses();
    [['name',2],['email',0],['subject',0],['message',10]].forEach(([field, minLen]) => {
        const el = document.getElementById(field);
        if (!el) return;
        const val = data[field] || '';
        const emailOk = field !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!val || val.trim().length < minLen || !emailOk) { el.classList.add('error'); isValid = false; }
        else { el.classList.add('success'); }
    });
    return isValid;
}

function removeValidationClasses() {
    if (!contactForm) return;
    contactForm.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error', 'success'));
}

async function sendEmail(formData) {
    // Try PHP handler
    const response = await fetch('contact.php', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
    if (response.ok) { const result = await response.json(); if (!result.error) return result; }
    // Fallback to mailto
    const subject = encodeURIComponent('Seaview Aged Care: ' + formData.subject);
    const body = encodeURIComponent('Name: '+formData.name+'\nEmail: '+formData.email+'\nMessage:\n'+formData.message);
    window.open('mailto:admin@seaviewhome.co.nz?subject='+subject+'&body='+body);
    throw new Error('Please send via your email client.');
}

function showMessage(message, type) {
    if (!contactForm) return;
    contactForm.querySelectorAll('.success-message, .error-message').forEach(m => m.remove());
    const div = document.createElement('div');
    div.className = type + '-message';
    div.style.display = 'block';
    div.textContent = message;
    contactForm.insertBefore(div, contactForm.firstChild);
    setTimeout(() => div.remove(), 5000);
}

// Sticky navbar shrink on scroll + hero parallax
const navbar = document.querySelector('.navbar');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar shrink
    if (scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hero parallax: move text up and fade out as user scrolls
    if (heroContent && scrollY < window.innerHeight) {
        const ratio = scrollY / window.innerHeight;
        heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
        heroContent.style.opacity = 1 - ratio * 1.2;
    }
});

// Intersection Observer for scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
            scrollObserver.unobserve(entry.target); // animate once
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
});

// Observe all scroll-animated elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-fade-up, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in').forEach(el => {
        scrollObserver.observe(el);
    });
});

// Phone number formatting (for New Zealand numbers)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            if (value.startsWith('64')) {
                value = value.replace(/(\d{2})(\d{1})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
            } else if (value.startsWith('0')) {
                value = value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
            }
        }
        e.target.value = value;
    });
}

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('imageModal');
    if (modal.style.display === 'block' && e.key === 'Escape') {
        modal.style.display = 'none';
    }
});

// Print functionality
function printPage() {
    window.print();
}

// Contact form accessibility improvements
if (contactForm) {
    contactForm.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            e.target.parentElement.style.transform = 'scale(1.02)';
            e.target.parentElement.style.transition = 'transform 0.2s ease';
        }
    });
    contactForm.addEventListener('focusout', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            e.target.parentElement.style.transform = 'scale(1)';
        }
    });
}

// Initialize page - FORCE STAY AT TOP
document.addEventListener('DOMContentLoaded', () => {
    // Immediately force scroll to top
    window.history.replaceState(null, null, window.location.pathname);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Remove any hash from URL that might cause scrolling
    if (window.location.hash) {
        window.location.hash = '';
        window.history.replaceState(null, null, window.location.pathname);
    }
    
    // Preload images
    heroImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // No auto-focus on form fields to prevent scrolling
});

// Prevent any hash-based navigation on load
window.addEventListener('load', () => {
    // Clear any hash immediately
    if (window.location.hash) {
        window.location.hash = '';
        window.history.replaceState(null, null, window.location.pathname);
    }
    
    // Force scroll to top after everything loads
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 0);
    
    // Force again after a tiny delay to be absolutely sure
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Prevent back/forward navigation from scrolling
window.addEventListener('popstate', () => {
    window.scrollTo(0, 0);
});

// Also ensure page starts at top on page refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

console.log('Seaview Aged Care website loaded successfully!');
