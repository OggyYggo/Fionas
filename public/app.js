// ========== GSAP Animations ==========
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Hero section animations
function initHeroAnimations() {
    const timeline = gsap.timeline();
    
    // Animate hero heading with stagger
    timeline.fromTo('.hero h1', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    // Animate accent text with color change
    .fromTo('.accent-text', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
        '<0.3'
    )
    // Animate paragraph
    .fromTo('.hero p', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '<0.2'
    )
    // Animate buttons with stagger
    .fromTo('.hero-btns a', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)' },
        '<0.3'
    );
    
    // Add hover animation to buttons
    document.querySelectorAll('.hero-btns a').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Tour package card animations on scroll
function initTourCardAnimations() {
    const tourCards = gsap.utils.toArray('.tour-card');
    
    tourCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                scrub: false,
                markers: false
            },
            opacity: 0,
            y: 60,
            rotation: -5,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
        
        // Add hover animation
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Section header animations
function initSectionHeaderAnimations() {
    gsap.from('.section-header .subtitle', {
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 80%'
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: 'power3.out'
    });
    
    gsap.from('.section-header h2', {
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.section-header p', {
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 80%'
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
    });
}

// Destination card animations on scroll
function initDestinationCardAnimations() {
    const destinationCards = gsap.utils.toArray('.destination-card');
    
    destinationCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                scrub: false,
                markers: false
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

// Get DOM elements
const bookingForm = document.getElementById('bookingForm');
const messageDiv = document.getElementById('bookingMessage');
// Handle booking form submission
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Get form values
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const spot = document.getElementById('spot').value;
        const date = document.getElementById('date').value;
        const guests = parseInt(document.getElementById('guests').value);
        const packageType = document.getElementById('packageType').value;
        const notes = document.getElementById('notes').value;
        // Create booking object
        const bookingData = {
            fullname,
            email,
            phone,
            spot,
            date,
            guests,
            packageType,
            notes
        };
        // Validate form
        if (!validateBooking(bookingData)) {
            showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        try {
            // Send booking to server
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            if (response.ok) {
                const result = await response.json();
                showMessage(`Success! Your booking reference is: ${result.bookingId}. We'll contact you soon!`, 'success');
                bookingForm.reset();
                // Log booking for development
                console.log('Booking submitted:', bookingData);
            }
            else {
                showMessage('Booking submission failed. Please try again.', 'error');
            }
        }
        catch (error) {
            console.error('Error submitting booking:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    });
}
// Validate booking data
function validateBooking(data) {
    // Check email validity
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        console.log('Invalid email format');
        return false;
    }
    // Check phone validity (basic check for Philippines format)
    const phoneRegex = /^(\+63|0)[0-9]{10}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        console.log('Invalid phone format');
        return false;
    }
    // Check date is in future
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
        console.log('Date must be in the future');
        return false;
    }
    // Check guests
    if (data.guests < 1 || data.guests > 50) {
        console.log('Invalid number of guests');
        return false;
    }
    return true;
}
// Show message to user
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}
// ========== Navigation Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
// ========== Date Input Enhancement ==========
const dateInput = document.getElementById('date');
if (dateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0] || '';
    dateInput.setAttribute('min', today);
    // Set maximum date to 1 year from now
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const maxDateStr = maxDate.toISOString().split('T')[0] || '';
    dateInput.setAttribute('max', maxDateStr);
}
// ========== Guest Number Validation ==========
const guestInput = document.getElementById('guests');
if (guestInput) {
    guestInput.addEventListener('input', function () {
        if (this.value === '') {
            this.value = '1';
        }
    });
}
// ========== Analytics & Tracking ==========
// Track page views
function trackPageView() {
    console.log('Page view tracked - ' + new Date().toISOString());
}
// Track booking form interaction
if (bookingForm) {
    bookingForm.addEventListener('focus', function (e) {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
            console.log(`Form field focused: ${target.name}`);
        }
    }, true);
}
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    trackPageView();
    console.log('Bohol Travel Agency website loaded successfully!');
    
    // Initialize GSAP animations
    setTimeout(() => {
        initHeroAnimations();
        initSectionHeaderAnimations();
        initTourCardAnimations();
        initDestinationCardAnimations();
    }, 100);
});
// ========== Mobile Navigation ==========
function setupMobileMenu() {
    // Add mobile menu toggle if needed
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && window.innerWidth <= 768) {
        console.log('Mobile menu setup complete');
    }
}
// Initialize mobile menu on load
window.addEventListener('load', setupMobileMenu);
// Re-check on resize
window.addEventListener('resize', setupMobileMenu);
export {};
//# sourceMappingURL=app.js.map