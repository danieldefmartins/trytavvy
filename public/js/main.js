// Business Types Scrolling Animation
const businessTypes = [
    'Realtors',
    'Plumbers',
    'Electricians',
    'General Contractors',
    'Handymen',
    'Food Trucks',
    'Mobile Businesses',
    'Mobile Groomers',
    'Kitchen Remodelers',
    'Bathroom Remodelers',
    'Roofers',
    'HVAC Technicians',
    'Landscapers',
    'Pool Cleaners',
    'Photographers',
    'Caterers',
    'Personal Trainers',
    'House Cleaners',
    'Painters',
    'Flooring Installers',
    'Pest Control',
    'Movers',
    'Tutors',
    'Pet Sitters',
    'Auto Detailers',
    'Pressure Washers',
    'Window Cleaners',
    'Locksmiths',
    'Appliance Repair',
    'Garage Door Repair'
];

let currentIndex = 0;
let speed = 2000; // Start slow
const minSpeed = 80; // Fastest speed
const acceleration = 0.85; // Speed multiplier each iteration
let cycleCount = 0;
const maxCycles = 3; // Number of full cycles before landing

const businessTypeElement = document.getElementById('business-type');

function animateBusinessTypes() {
    if (!businessTypeElement) return;
    
    // Fade out
    businessTypeElement.style.opacity = '0';
    
    setTimeout(() => {
        // Change text
        currentIndex = (currentIndex + 1) % businessTypes.length;
        businessTypeElement.textContent = businessTypes[currentIndex];
        
        // Fade in
        businessTypeElement.style.opacity = '1';
        
        // Check if we've completed a cycle
        if (currentIndex === 0) {
            cycleCount++;
        }
        
        // After max cycles, slow down and land on "Every Professional"
        if (cycleCount >= maxCycles && currentIndex === businessTypes.length - 1) {
            // Final landing
            setTimeout(() => {
                businessTypeElement.style.opacity = '0';
                setTimeout(() => {
                    businessTypeElement.textContent = 'Every Professional';
                    businessTypeElement.style.opacity = '1';
                    
                    // Restart after a pause
                    setTimeout(() => {
                        cycleCount = 0;
                        speed = 2000;
                        animateBusinessTypes();
                    }, 5000);
                }, 100);
            }, 1500);
            return;
        }
        
        // Accelerate
        if (speed > minSpeed) {
            speed = Math.max(speed * acceleration, minSpeed);
        }
        
        // Continue animation
        setTimeout(animateBusinessTypes, speed);
    }, 100);
}

// Start animation after page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateBusinessTypes, 1000);
});

// Animated Counter for Stats
function animateCounter(element, target, prefix = '', suffix = '+') {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas
        const formatted = Math.floor(current).toLocaleString();
        element.textContent = prefix + formatted + suffix;
    }, stepDuration);
}

// Intersection Observer for Stats Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const prefix = stat.dataset.prefix || '';
                const suffix = stat.dataset.suffix || '+';
                if (target) {
                    animateCounter(stat, target, prefix, suffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stats section
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// FAQ accordion enhancement
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', function() {
        if (this.open) {
            // Close other open items
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== this && other.open) {
                    other.open = false;
                }
            });
        }
    });
});

// Spot counter animation
function updateSpotCounter() {
    const spotsElement = document.getElementById('spots-count');
    if (spotsElement) {
        const baseSpots = 435;
        spotsElement.textContent = baseSpots;
    }
}

document.addEventListener('DOMContentLoaded', updateSpotCounter);

// Scroll animations for sections
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section, .problem-card, .feature-card, .testimonial-card, .pricing-card').forEach(el => {
        el.classList.add('fade-up');
        fadeObserver.observe(el);
    });
});

// Add CSS for fade animations
const style = document.createElement('style');
style.textContent = `
    .fade-up {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
