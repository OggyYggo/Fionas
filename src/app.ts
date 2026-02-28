// ========== Booking Form Handler ==========
interface BookingData {
    fullname: string;
    email: string;
    phone: string;
    spot: string;
    date: string;
    guests: number;
    packageType: string;
    notes: string;
}

// Get DOM elements
const bookingForm = document.getElementById('bookingForm') as HTMLFormElement;
const messageDiv = document.getElementById('bookingMessage') as HTMLDivElement;

// Handle booking form submission
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        // Get form values
        const fullname = (document.getElementById('fullname') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const spot = (document.getElementById('spot') as HTMLSelectElement).value;
        const date = (document.getElementById('date') as HTMLInputElement).value;
        const guests = parseInt((document.getElementById('guests') as HTMLInputElement).value);
        const packageType = (document.getElementById('packageType') as HTMLSelectElement).value;
        const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;

        // Create booking object
        const bookingData: BookingData = {
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
            } else {
                showMessage('Booking submission failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    });
}

// Validate booking data
function validateBooking(data: BookingData): boolean {
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
function showMessage(message: string, type: 'success' | 'error'): void {
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
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href) as HTMLElement;
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
const dateInput = document.getElementById('date') as HTMLInputElement;
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
const guestInput = document.getElementById('guests') as HTMLInputElement;
if (guestInput) {
    guestInput.addEventListener('input', function() {
        if (this.value === '') {
            this.value = '1';
        }
    });
}

// ========== Analytics & Tracking ==========
// Track page views
function trackPageView(): void {
    console.log('Page view tracked - ' + new Date().toISOString());
}

// Track booking form interaction
if (bookingForm) {
    bookingForm.addEventListener('focus', function(e: FocusEvent) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
            console.log(`Form field focused: ${(target as HTMLInputElement).name}`);
        }
    }, true);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    trackPageView();
    console.log('Bohol Travel Agency website loaded successfully!');
});

// ========== Mobile Navigation ==========
function setupMobileMenu(): void {
    // Add mobile menu toggle if needed
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (navLinks && window.innerWidth <= 768) {
        console.log('Mobile menu setup complete');
    }
}

// Initialize mobile menu on load
window.addEventListener('load', setupMobileMenu);

// Re-check on resize
window.addEventListener('resize', setupMobileMenu);

