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

// Form validation and submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send email using a simple method (you'll need to implement server-side handling)
        await sendEmail(formObject);
        showMessage('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
        removeValidationClasses();
    } catch (error) {
        showMessage('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function validateForm(data) {
    let isValid = true;
    
    // Remove previous validation classes
    removeValidationClasses();
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        document.getElementById('name').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('name').classList.add('success');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        document.getElementById('email').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('email').classList.add('success');
    }
    
    // Validate subject
    if (!data.subject) {
        document.getElementById('subject').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('subject').classList.add('success');
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        document.getElementById('message').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('message').classList.add('success');
    }
    
    return isValid;
}

function removeValidationClasses() {
    const formElements = contactForm.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        element.classList.remove('error', 'success');
    });
}

async function sendEmail(formData) {
    try {
        // Option 1: Try using EmailJS (free email service)
        if (typeof emailjs !== 'undefined') {
            const result = await emailjs.send(
                'YOUR_SERVICE_ID', // You'll need to set this up
                'YOUR_TEMPLATE_ID', // You'll need to set this up
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone || 'Not provided',
                    subject: formData.subject,
                    message: formData.message,
                    to_email: 'admin@seaviewhome.co.nz'
                },
                'YOUR_PUBLIC_KEY' // You'll need to set this up
            );
            return { success: true, message: 'Message sent successfully!' };
        }
        
        // Option 2: Try using your PHP handler
        const response = await fetch('contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }

        return result;
        
    } catch (error) {
        // Option 3: Try using Formspree (free form service)
        try {
            const formspreeResponse = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    _replyto: formData.email,
                    _subject: `Seaview Contact: ${formData.subject}`
                })
            });

            if (formspreeResponse.ok) {
                return { success: true, message: 'Message sent successfully via Formspree!' };
            }
        } catch (formspreeError) {
            console.log('Formspree also failed:', formspreeError);
        }
        
        // Option 4: Use Web3Forms (another free service)
        try {
            const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: 'a64ad81e-42af-4a69-b268-ce6d6d454825', // Your Web3Forms access key
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `Seaview Contact: ${formData.subject}`,
                    message: formData.message,
                    to: 'admin@seaviewhome.co.nz'
                })
            });

            const web3Result = await web3formsResponse.json();
            if (web3Result.success) {
                return { success: true, message: 'Message sent successfully!' };
            }
        } catch (web3Error) {
            console.log('Web3Forms failed:', web3Error);
        }
        
        // Fallback to mailto if all services fail
        console.warn('All email services failed, using mailto fallback');
        
        const subject = encodeURIComponent(`Seaview Aged Care: ${formData.subject}`);
        const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}

---
Please respond to this inquiry as soon as possible.
        `);
        
        const mailtoLink = `mailto:admin@seaviewhome.co.nz?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
        
        throw new Error('Please send the email using your email client, or try again later.');
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = contactForm.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.style.display = 'block';
    messageDiv.textContent = message;
    
    // Insert message at the top of the form
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Phone number formatting (for New Zealand numbers)
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format for NZ numbers
    if (value.length >= 2) {
        if (value.startsWith('64')) {
            // International format
            value = value.replace(/(\d{2})(\d{1})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
        } else if (value.startsWith('0')) {
            // National format
            value = value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
        }
    }
    
    e.target.value = value;
});

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
