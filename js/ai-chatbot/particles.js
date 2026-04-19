export function initParticles(canvas) {
    if (!canvas) return () => { };

    const ctx = canvas.getContext('2d');
    if (!ctx) return () => { };

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    let raf = null;
    let running = true;
    let particles = [];

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (min, max) => min + Math.random() * (max - min);

    const seed = () => {
        const rect = canvas.getBoundingClientRect();
        const count = Math.max(22, Math.floor((rect.width * rect.height) / 26000));
        particles = Array.from({ length: count }).map(() => ({
            x: rand(0, rect.width),
            y: rand(0, rect.height),
            r: rand(0.8, 2.2),
            vx: rand(-0.25, 0.25),
            vy: rand(-0.18, 0.18),
            a: rand(0.08, 0.22)
        }));
    };

    const draw = () => {
        if (!running) return;
        raf = requestAnimationFrame(draw);
        if (prefersReduced) return;

        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // subtle fog
        const g = ctx.createRadialGradient(rect.width * 0.2, rect.height * 0.1, 0, rect.width * 0.2, rect.height * 0.1, rect.width);
        g.addColorStop(0, 'rgba(124,58,237,0.08)');
        g.addColorStop(0.6, 'rgba(34,211,238,0.05)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, rect.width, rect.height);

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -10) p.x = rect.width + 10;
            if (p.x > rect.width + 10) p.x = -10;
            if (p.y < -10) p.y = rect.height + 10;
            if (p.y > rect.height + 10) p.y = -10;

            ctx.beginPath();
            ctx.fillStyle = `rgba(226,232,240,${p.a})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const onResize = () => {
        resize();
        seed();
    };

    onResize();
    draw();
    window.addEventListener('resize', onResize);

    return () => {
        running = false;
        window.removeEventListener('resize', onResize);
        if (raf) cancelAnimationFrame(raf);
    };
}
