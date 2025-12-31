// Confetti Animation
class ConfettiAnimation {
    constructor() {
        this.canvas = document.getElementById('confetti');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    createConfetti(x, y, count = 50) {
        const colors = ['#ff6b6b', '#ff8e53', '#ffd700', '#00d4ff', '#00ff88', '#ff006e'];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: Math.random() * -10 - 5,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }
    
    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life -= 0.015;
            p.rotation += 0.1;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Initialize confetti
const confetti = new ConfettiAnimation();

// Countdown Timer
function updateCountdown() {
    // Target date: January 1, 2026, 00:00:00
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    
    function tick() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        // If countdown is finished
        if (difference < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update DOM with leading zeros
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // Update every 1000ms
        setTimeout(tick, 1000);
    }
    
    tick();
}

// Celebration Button
document.getElementById('celebrateBtn').addEventListener('click', function() {
    // Create confetti from button location
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create multiple bursts
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confetti.createConfetti(x, y, 80);
            confetti.animate();
        }, i * 200);
    }
    
    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Add some visual feedback to button
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 100);
});

// Wish card interactions
document.querySelectorAll('.wish-card').forEach(card => {
    card.addEventListener('click', function() {
        const icon = this.querySelector('.wish-icon');
        
        // Animate icon
        icon.style.animation = 'none';
        setTimeout(() => {
            icon.style.animation = '';
        }, 10);
        
        // Create small confetti burst
        const rect = this.getBoundingClientRect();
        confetti.createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
        confetti.animate();
    });
});
// Floating Hearts
function createHeart(x = Math.random() * window.innerWidth){
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = "💖";
  heart.style.left = x + "px";
  heart.style.animationDuration = (4 + Math.random() * 4) + "s";
  document.body.appendChild(heart);

  setTimeout(()=>heart.remove(),8000);
}
setInterval(createHeart,600);

// Page load animation
window.addEventListener('load', () => {
    updateCountdown();
    
    // Trigger initial confetti burst (small)
    setTimeout(() => {
        confetti.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
        confetti.animate();
    }, 500);
});

// Mouse move parallax effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Add some interactive glow effect
const container = document.querySelector('.container');
if (container) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Optional: Could add radial gradient background movement here
        // container.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(0, 212, 255, 0.1), transparent)`;
    });
}

// Easter egg: Keyboard shortcut for extra confetti
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        confetti.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 150);
        confetti.animate();
    }
});

// Mobile touch support
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.wish-card')) {
            const touch = e.touches[0];
            confetti.createConfetti(touch.clientX, touch.clientY, 30);
            confetti.animate();
        }
    });
}

console.log('🎉 Welcome to the New Year 2026 Celebration! 🎉');
console.log('Tip: Press Ctrl + Space for extra confetti!');
