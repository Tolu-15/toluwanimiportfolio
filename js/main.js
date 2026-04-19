document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('skillsPieChart');
    if (ctx && window.Chart) {
        new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['JavaScript', 'Python', 'Java', 'HTML/CSS', 'UI/UX'],
                datasets: [{
                    data: [30, 15, 5, 47, 3],
                    backgroundColor: [
                        'rgba(124, 58, 237, 0.9)',
                        'rgba(34, 211, 238, 0.9)',
                        'rgba(248, 150, 30, 0.9)',
                        'rgba(239, 68, 68, 0.9)',
                        'rgba(167, 139, 250, 0.9)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12,
                                weight: 500
                            },
                            color: 'rgba(226, 232, 240, 0.85)'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        },
                        bodyFont: {
                            weight: '500'
                        },
                        padding: 12,
                        displayColors: false
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    document.querySelectorAll('.progress-bar').forEach(bar => {
        const target = bar.dataset.progress || '0';
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = `${target}%`;
        }, 120);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    const toggleBackToTop = () => {
        const shouldShow = window.scrollY > 500;
        backToTopButton.classList.toggle('is-visible', shouldShow);
    };

    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.top-nav .nav-links');
    if (!nav) return;

    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    if (navLinks.length === 0) return;

    const linkTargets = navLinks
        .map((link) => {
            const href = link.getAttribute('href') || '';
            const id = href.startsWith('#') ? href.slice(1) : '';
            if (!id) return null;

            const element = document.getElementById(id);
            if (!element) return null;

            const section = element.closest('section[id]') || element;
            return { link, id, section };
        })
        .filter(Boolean);

    if (linkTargets.length === 0) return;

    const sections = Array.from(new Set(linkTargets.map((t) => t.section)));

    const setActive = (activeId) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const isActive = href === `#${activeId}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleSection = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visibleSection) return;

            const bestMatch = linkTargets.find((t) => t.section === visibleSection.target);
            if (!bestMatch) return;
            setActive(bestMatch.id);
        },
        { root: null, threshold: [0.25, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
});

document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.top-nav .nav-links');
    if (!nav) return;

    const experienceLink = nav.querySelector('a[href="#experience"]');
    if (!experienceLink) return;

    experienceLink.addEventListener('click', (e) => {
        const aboutSection = document.getElementById('about');
        if (!aboutSection || typeof window.opentab !== 'function') return;

        e.preventDefault();
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const tabButtons = Array.from(document.querySelectorAll('.tab-links'));
        const tabButton = tabButtons.find((button) => /experience/i.test(button.textContent || ''));
        window.opentab('experience', tabButton || undefined);
    });
});

(function () {
    const quotes = [
        {
            text: "Strength isn't about never falling\u2014it's about how many times you rise. Because in the end, the struggle is where courage takes root.",
            author: "Toluwanimi"
        },
        {
            text: "Progress isn't about speed\u2014it's about direction. Because in the end, small steps with purpose outpace aimless sprints.",
            author: "Toluwanimi"
        },
        {
            text: "Surviving is winning, whatever it takes to survive.",
            author: "Franklin"
        },
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "Believe you can and you're halfway there.",
            author: "Theodore Roosevelt"
        },
        {
            text: "Everything you can imagine is real.",
            author: "Pablo Picasso"
        }
    ];

    let currentIndex = 0;
    const quoteText = document.getElementById("quoteText") || document.querySelector(".quote-text");
    const quoteAuthor = document.getElementById("quoteAuthor") || document.querySelector(".quote-author");
    const prevBtn = document.getElementById("prevQuote") || document.querySelector(".quote-nav.prev");
    const nextBtn = document.getElementById("nextQuote") || document.querySelector(".quote-nav.next");
    const progressBar = document.querySelector(".quote-progress-bar");
    let autoRotateTimer = null;

    if (!quoteText || !quoteAuthor || !prevBtn || !nextBtn) return;

    function updateQuote(index) {
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        quoteText.classList.remove("show");
        quoteAuthor.classList.remove("show");
        if (progressBar) {
            progressBar.style.transition = "none";
            progressBar.style.width = "0%";
        }

        setTimeout(() => {
            quoteText.textContent = quotes[index].text;
            quoteAuthor.textContent = `- ${quotes[index].author}`;

            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
            quoteText.classList.add("show");
            quoteAuthor.classList.add("show");
            if (progressBar) {
                progressBar.offsetHeight;
                progressBar.style.transition = "width 6s linear";
                progressBar.style.width = "100%";
            }
        }, 300);
    }

    function queueNextQuote() {
        if (autoRotateTimer) {
            clearTimeout(autoRotateTimer);
        }
        autoRotateTimer = setTimeout(() => {
            currentIndex = (currentIndex + 1) % quotes.length;
            updateQuote(currentIndex);
            queueNextQuote();
        }, 6000);
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
        updateQuote(currentIndex);
        queueNextQuote();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        updateQuote(currentIndex);
        queueNextQuote();
    });

    updateQuote(currentIndex);
    queueNextQuote();
})();

window.opentab = function opentab(tabname, element) {
    const tablinks = document.getElementsByClassName("tab-links");
    const tabcontents = document.getElementsByClassName("tab-contents");

    for (const tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (const tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }

    if (element) {
        element.classList.add("active-link");
    }
    const target = document.getElementById(tabname);
    if (target) {
        target.classList.add("active-tab");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const texts = ["Front-end Developer", "UI/UX Designer", "Building Landing Pages"];
    let index = 0;
    const typingElement = document.querySelector(".hero-kicker");

    if (!typingElement) return;

    function typeEffect(text, i = 0) {
        if (i < text.length) {
            typingElement.innerHTML = text.substring(0, i + 1) + "|";
            setTimeout(() => typeEffect(text, i + 1), 90);
        } else {
            setTimeout(() => deleteEffect(text), 800);
        }
    }

    function deleteEffect(text, i = text.length) {
        if (i > 0) {
            typingElement.innerHTML = text.substring(0, i - 1) + "|";
            setTimeout(() => deleteEffect(text, i - 1), 60);
        } else {
            index = (index + 1) % texts.length;
            setTimeout(() => typeEffect(texts[index]), 300);
        }
    }

    typeEffect(texts[index]);
});

(function () {
    const elements = {
        chatMessages: document.getElementById('chat-messages'),
        userInput: document.getElementById('user-input'),
        sendButton: document.getElementById('send-button'),
        typingIndicator: document.getElementById('typing-indicator')
    };

    if (Object.values(elements).some(el => !el)) {
        return;
    }

    const sanitizeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const simpleMarkdown = (text) => {
        try {
            const safeText = sanitizeHTML(text);
            return safeText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        } catch (error) {
            console.error('Markdown parsing error:', error);
            return sanitizeHTML(text);
        }
    };

    const showTypingIndicator = () => {
        elements.typingIndicator.style.display = 'flex';
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    };

    const hideTypingIndicator = () => {
        elements.typingIndicator.style.display = 'none';
    };

    const addBotMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = simpleMarkdown(message);
        elements.chatMessages.appendChild(messageElement);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    };

    const addUserMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.textContent = message;
        elements.chatMessages.appendChild(messageElement);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    };

    const showQuickReplies = (replies) => {
        const existingReplies = elements.chatMessages.querySelector('.quick-replies');
        if (existingReplies) existingReplies.remove();

        if (!replies || replies.length === 0) return;

        const repliesContainer = document.createElement('div');
        repliesContainer.className = 'quick-replies';
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.setAttribute('data-reply', reply);
            repliesContainer.appendChild(button);
        });
        elements.chatMessages.appendChild(repliesContainer);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    };

    const knowledgeBase = {
        greetings: {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            response: "Hello! I'm Toluwanimi's assistant. How can I help you today?",
            followUps: ["Tell me about Toluwanimi", "What services does he offer?", "How can I contact him?"]
        },
        about: {
            keywords: ['about', 'who', 'tell me', 'background', 'bio'],
            response: "Toluwanimi is a Front-End Developer and Industrial Mathematics & Computer Science student at Covenant University. He enjoys building modern, responsive web experiences and improving UI/UX.",
            followUps: ["What skills does he have?", "Show me his projects", "How long has he been coding?"]
        },
        skills: {
            keywords: ['skills', 'technologies', 'tech stack', 'languages', 'tools'],
            response: "Toluwanimi works with HTML, CSS, JavaScript, and also has experience with Python and Java. He's learning UI/UX and enjoys building clean, responsive interfaces.",
            followUps: ["Does he use frameworks?", "Is he available for work?", "How can we work together?"]
        },
        projects: {
            keywords: ['projects', 'work', 'portfolio', 'built', 'apps'],
            response: "He has worked on projects like Afthonia Foods, Grace Mark Academy quiz app, and other web experiences. You can check the Projects section for more.",
            followUps: ["Open projects", "Tell me about Afthonia", "Show me a quiz app"]
        },
        contact: {
            keywords: ['contact', 'email', 'reach', 'hire', 'call', 'message'],
            response: "You can contact Toluwanimi via email at toluwanimibabalola2707@gmail.com or on Telegram at @t_dev25_bot. You can also use the contact form on this page.",
            followUps: ["Open contact form", "Copy email address", "Open Telegram"]
        },
        services: {
            keywords: ['services', 'offer', 'do', 'help', 'build'],
            response: "Toluwanimi offers Front-End Development, UI/UX Design (beginner), and Landing Page builds. He focuses on clean UI, responsive layouts, and accessible interfaces.",
            followUps: ["What is his process?", "Can he build a landing page?", "Is he available now?"]
        },
        default: {
            response: "I'm not fully sure about that, but I can help you find it on this page. Try asking about his skills, projects, services, or how to contact him.",
            followUps: ["Show skills", "Show projects", "How to contact?"]
        }
    };

    const getResponse = (input) => {
        const normalizedInput = input.toLowerCase().trim();

        for (const [key, data] of Object.entries(knowledgeBase)) {
            if (key === 'default') continue;

            if (data.keywords.some(keyword => normalizedInput.includes(keyword))) {
                return { response: data.response, followUps: data.followUps };
            }
        }

        return { response: knowledgeBase.default.response, followUps: knowledgeBase.default.followUps };
    };

    const handleSendMessage = async () => {
        try {
            const message = elements.userInput.value.trim();
            if (!message) return;

            addUserMessage(message);
            elements.userInput.value = '';

            showTypingIndicator();
            showQuickReplies([]);

            await new Promise(resolve => setTimeout(resolve, 700));
            const { response, followUps } = getResponse(message);
            hideTypingIndicator();
            addBotMessage(response);
            showQuickReplies(followUps);
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
            addBotMessage('Oops, something went wrong. Let\u2019s try that again!');
            hideTypingIndicator();
        }
    };

    const initChat = () => {
        addBotMessage(knowledgeBase.greetings.response);
        showQuickReplies(knowledgeBase.greetings.followUps);
    };

    const setupEventListeners = () => {
        elements.sendButton.addEventListener('click', handleSendMessage);
        elements.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        elements.chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const reply = e.target.getAttribute('data-reply');
                if (reply) {
                    elements.userInput.value = reply;
                    handleSendMessage();
                }
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        try {
            initChat();
            setupEventListeners();
        } catch (error) {
            console.error('Initialization failed:', error);
            addBotMessage('Failed to initialize chat. Please refresh the page.');
        }
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('nexoraForm');
    if (!form) return;

    const statusMessage = document.getElementById('form-status');
    const submitBtn = form.querySelector('.submit-btn');

    const projectRadios = document.querySelectorAll('input[name="hasProject"]');
    const projectDetails = document.querySelector('.project-details');
    projectRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                projectDetails.classList.add('show');
                projectDetails.classList.remove('hidden');
            } else {
                projectDetails.classList.add('hidden');
                projectDetails.classList.remove('show');
            }
        });
    });

    const workRadios = document.querySelectorAll('input[name="workTogether"]');
    const roleSelection = document.querySelector('.role-selection');
    workRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                roleSelection.classList.add('show');
                roleSelection.classList.remove('hidden');
            } else {
                roleSelection.classList.add('hidden');
                roleSelection.classList.remove('show');
            }
        });
    });

    form.addEventListener('submit', function () {
        if (submitBtn) {
            submitBtn.classList.add('loading');
        }
        showStatusMessage('Sending your message...', 'success');
    });

    function showStatusMessage(message, type) {
        if (!statusMessage) return;
        statusMessage.textContent = message;
        statusMessage.className = `status-message show-message ${type}`;
        setTimeout(() => {
            statusMessage.classList.remove('show-message');
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo || typeof heroVideo.play !== 'function') return;

    const safePlay = () => {
        const playAttempt = heroVideo.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => { });
        }
    };

    const safePause = () => {
        try {
            heroVideo.pause();
        } catch {
        }
    };

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) safePause();
        else safePlay();
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) safePlay();
                else safePause();
            }
        }, { threshold: 0.15 });

        observer.observe(heroVideo);
    }
});
