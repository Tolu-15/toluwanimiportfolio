document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initActiveLinks();
    initTabs();
    initTyped();
    initReveal();
    initBackToTop();
    initHeroVideo();
    initContactForm();
    initYear();
});

function initNav() {
    const header = document.querySelector('.top-nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!toggle || !links) return;

    const setOpen = (open) => {
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
    links.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) setOpen(false);
    });
}

function initActiveLinks() {
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
        links.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        },
        { rootMargin: '-45% 0px -50% 0px' }
    );

    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

function initTabs() {
    const tabList = document.querySelector('[role="tablist"]');
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));

    const select = (tab) => {
        tabs.forEach((t) => {
            const selected = t === tab;
            t.setAttribute('aria-selected', String(selected));
            t.tabIndex = selected ? 0 : -1;
            const panel = document.getElementById(t.getAttribute('aria-controls'));
            if (panel) panel.hidden = !selected;
        });
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (e) => {
            let next = null;
            if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
            if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home') next = tabs[0];
            if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) {
                e.preventDefault();
                select(next);
                next.focus();
            }
        });
    });
}

function initTyped() {
    const el = document.querySelector('[data-typed]');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = el.dataset.typed.split('|').map((w) => w.trim()).filter(Boolean);
    if (words.length < 2) return;

    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    const tick = () => {
        const word = words[wordIndex];
        if (deleting) {
            charIndex -= 1;
            el.textContent = word.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                return setTimeout(tick, 300);
            }
            return setTimeout(tick, 45);
        }

        const nextWord = words[wordIndex];
        charIndex += 1;
        el.textContent = nextWord.slice(0, charIndex);
        if (charIndex === nextWord.length) {
            deleting = true;
            return setTimeout(tick, 1800);
        }
        return setTimeout(tick, 85);
    };

    setTimeout(tick, 1800);
}

function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
}

function initBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;

    const toggle = () => button.classList.toggle('is-visible', window.scrollY > 600);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initHeroVideo() {
    const video = document.querySelector('.hero-video');
    if (!video || typeof video.play !== 'function') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        return;
    }

    const play = () => {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => { });
    };

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? play() : video.pause()),
            { threshold: 0.1 }
        ).observe(video);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) video.pause();
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('form-status');
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', () => {
        // Let the browser submit normally to FormSubmit; just give feedback.
        if (button) {
            button.disabled = true;
            button.querySelector('span').textContent = 'Sending…';
        }
        if (status) {
            status.classList.remove('is-error');
            status.textContent = 'Sending your message…';
        }
    });

    // Restore the button if the user navigates back to this page.
    window.addEventListener('pageshow', () => {
        if (button) {
            button.disabled = false;
            button.querySelector('span').textContent = 'Send message';
        }
        if (status) status.textContent = '';
    });
}

function initYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = String(new Date().getFullYear());
    });
}
