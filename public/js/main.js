document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Founders Access Countdown
    const spotsLeftEl = document.getElementById('spots-left');
    const progressFillEl = document.getElementById('progress-fill');
    
    if (spotsLeftEl && progressFillEl) {
        const totalSpots = 1000;
        let spotsLeft = 768; // Starting number

        const updateCountdown = () => {
            const spotsTaken = totalSpots - spotsLeft;
            const percentage = (spotsTaken / totalSpots) * 100;
            spotsLeftEl.textContent = spotsLeft;
            progressFillEl.style.width = `${percentage}%`;
        };

        // Simulate spots being taken
        setInterval(() => {
            if (spotsLeft > 200) { // Don't let it go to zero too fast
                spotsLeft -= Math.floor(Math.random() * 3) + 1;
                updateCountdown();
            }
        }, 5000); // Update every 5 seconds

        updateCountdown();
    }
    
    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .problem-card, .signal-item, .path-card, .founders-box').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });
});
