/**
 * Жизнь в Мегаполисе - Canvas Floating Particles Engine
 * Lightweight, zero-allocation floating embers & motes for loading screen.
 */

(function () {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    const PARTICLE_COUNT = 55;
    const particles = [];

    const COLORS = [
        'rgba(0, 240, 255, ',   // Neon Cyan
        'rgba(255, 183, 0, ',   // Warm Gold
        'rgba(255, 0, 119, ',   // Hot Pink
        'rgba(255, 255, 255, '  // Pure Sparkle
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.2 + 0.8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            baseAlpha: Math.random() * 0.55 + 0.25,
            alpha: 0,
            vx: (Math.random() - 0.5) * 0.45,
            vy: -(Math.random() * 0.6 + 0.2), // Upward ambient draft
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2
        };
    }

    function init() {
        resize();
        window.addEventListener('resize', resize, { passive: true });

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }

        requestAnimationFrame(render);
    }

    let lastTime = performance.now();

    function render(currentTime) {
        const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Position integration
            p.x += p.vx * 60 * dt;
            p.y += p.vy * 60 * dt;

            // Pulsing alpha
            p.pulseOffset += p.pulseSpeed;
            p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.pulseOffset));

            // Wrap around edges
            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            // Draw particle with glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.shadowColor = p.color + '0.8)';
            ctx.shadowBlur = p.radius * 4;
            ctx.fill();
        }

        // Reset shadow
        ctx.shadowBlur = 0;

        requestAnimationFrame(render);
    }

    window.addEventListener('DOMContentLoaded', init);
})();
