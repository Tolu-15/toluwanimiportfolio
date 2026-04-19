import { profile, commands as commandList } from './data.js';

function normalize(text) {
    return String(text || '').trim();
}

function lower(text) {
    return normalize(text).toLowerCase();
}

function nowTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function hasAny(text, words) {
    return words.some((w) => text.includes(w));
}

function makeFollowups(items) {
    return items.slice(0, 4).map((label) => ({ label }));
}

function formatContact() {
    return {
        type: 'contact',
        title: 'Contact Toluwanimi',
        items: [
            { label: 'Email', value: profile.links.email, href: `mailto:${profile.links.email}` },
            { label: 'LinkedIn', value: 'Open profile', href: profile.links.linkedin },
            { label: 'GitHub', value: 'View repos', href: profile.links.github },
            { label: 'Phone', value: profile.links.phone, href: `tel:${profile.links.phone}` }
        ]
    };
}

function aboutResponse() {
    return {
        blocks: [
            {
                type: 'text',
                text:
                    `I\u2019m ${profile.shortName}\u2019s AI assistant.\n\n` +
                    `Name: ${profile.name}\n` +
                    `University: ${profile.university}\n` +
                    `Course: ${profile.course}\n` +
                    `Role: ${profile.role}\n` +
                    `Location: ${profile.location}\n\n` +
                    `I can also show projects, skills, certifications, goals, services, and contact details.`
            },
            {
                type: 'ctaRow',
                actions: [
                    { label: 'View Projects', href: 'projects/' },
                    { label: 'Contact Toluwanimi', href: '#contact' }
                ]
            }
        ],
        followups: makeFollowups(['/skills', '/projects', '/contact', 'Is he available for internships?'])
    };
}

function skillsResponse() {
    const badges = [
        ...profile.skills.frontend.map((s) => ({ label: s })),
        ...profile.skills.uiux.map((s) => ({ label: s })),
        ...profile.skills.cybersecurity.map((s) => ({ label: s }))
    ];

    return {
        blocks: [
            {
                type: 'text',
                text:
                    `Here\u2019s ${profile.shortName}\u2019s current skill snapshot (and what he\u2019s actively growing):`
            },
            {
                type: 'badges',
                title: 'Frontend / UI / Security',
                items: badges
            },
            {
                type: 'text',
                text:
                    `Programming tools he uses: ${profile.skills.programming.join(', ')}.`
            }
        ],
        followups: makeFollowups(['Show frontend projects', '/projects', '/contact', '/services'])
    };
}

function projectsResponse(filter = null) {
    const projects = profile.projects.filter((p) => {
        if (!filter) return true;
        const tags = (p.tags || []).map((t) => t.toLowerCase());
        return tags.some((t) => t.includes(filter));
    });

    const cards = projects.map((p) => ({
        title: p.name,
        description: p.description,
        tags: p.tags || [],
        ctas: p.ctas || []
    }));

    return {
        blocks: [
            {
                type: 'text',
                text: projects.length
                    ? `Here are ${profile.shortName}\u2019s featured projects:`
                    : `I don\u2019t have a matching project for that filter yet \u2014 want to see all projects instead?`
            },
            ...(cards.length ? [{ type: 'cards', items: cards }] : []),
            {
                type: 'ctaRow',
                actions: [
                    { label: 'Open Projects', href: 'projects/' },
                    { label: 'Hire Me', href: '#contact' }
                ]
            }
        ],
        followups: makeFollowups(['What is Nexora Tel?', 'Show frontend projects', '/skills', '/contact'])
    };
}

function availabilityResponse() {
    const yesNo = (v) => (v ? 'Yes' : 'Not right now');
    return {
        blocks: [
            {
                type: 'text',
                text:
                    `Availability:\n` +
                    `Internships: ${yesNo(profile.availability.internships)}\n` +
                    `Freelance: ${yesNo(profile.availability.freelance)}\n` +
                    `Collaborations: ${yesNo(profile.availability.collaborations)}\n\n` +
                    `If you want to work together, send a quick message and include your timeline + goals.`
            },
            formatContact()
        ],
        followups: makeFollowups(['/contact', 'What services does he offer?', 'Show frontend projects', 'What are his goals?'])
    };
}

function certificationsResponse() {
    return {
        blocks: [
            {
                type: 'text',
                text: `Certifications: ${profile.certifications.join(', ')}.`
            }
        ],
        followups: makeFollowups(['/goals', '/skills', '/projects', '/contact'])
    };
}

function goalsResponse() {
    return {
        blocks: [
            { type: 'text', text: `Goals & future plans:` },
            { type: 'list', items: profile.goals.map((g) => ({ label: g })) },
            { type: 'ctaRow', actions: [{ label: 'Contact Toluwanimi', href: '#contact' }] }
        ],
        followups: makeFollowups(['What skills is he growing?', '/projects', '/services', '/contact'])
    };
}

function servicesResponse() {
    return {
        blocks: [
            { type: 'text', text: `Services:` },
            { type: 'badges', title: 'What he can deliver', items: profile.services.map((s) => ({ label: s })) },
            { type: 'ctaRow', actions: [{ label: 'Hire Me', href: '#contact' }] }
        ],
        followups: makeFollowups(['What is your process?', '/projects', '/contact', 'Is he available for freelance?'])
    };
}

function faqResponse() {
    return {
        blocks: [
            { type: 'text', text: 'FAQ:' },
            {
                type: 'faq',
                items: profile.faq.map((f) => ({ q: f.q, a: f.a }))
            }
        ],
        followups: makeFollowups(['/contact', '/projects', '/skills', 'Is he available for internships?'])
    };
}

function resumeResponse() {
    return {
        blocks: [
            {
                type: 'text',
                text:
                    `I don\u2019t see a resume file linked yet on this site.\n\n` +
                    `If you want, I can help you add a downloadable resume button (PDF) and wire it into this chatbot.`
            },
            { type: 'ctaRow', actions: [{ label: 'Contact Toluwanimi', href: '#contact' }] }
        ],
        followups: makeFollowups(['/contact', '/skills', '/projects', 'Show certifications'])
    };
}

export function classifyIntent(userText) {
    const t = lower(userText);

    if (t.startsWith('/')) {
        const cmd = t.split(/\s+/)[0];
        if (commandList.includes(cmd)) return { kind: 'command', cmd };
        return { kind: 'unknownCommand', cmd };
    }

    if (hasAny(t, ['contact', 'email', 'linkedin', 'github', 'phone'])) return { kind: 'contact' };
    if (hasAny(t, ['intern', 'internship', 'available', 'freelance', 'collab'])) return { kind: 'availability' };
    if (hasAny(t, ['project', 'projects', 'nexora', 'afthonia', 'work'])) return { kind: 'projects' };
    if (hasAny(t, ['skill', 'skills', 'frontend', 'ui', 'ux', 'cyber', 'security', 'programming'])) return { kind: 'skills' };
    if (hasAny(t, ['university', 'school', 'education', 'course'])) return { kind: 'about' };
    if (hasAny(t, ['goal', 'goals', 'future', 'plan'])) return { kind: 'goals' };
    if (hasAny(t, ['service', 'services', 'offer', 'pricing'])) return { kind: 'services' };
    if (hasAny(t, ['cert', 'certification'])) return { kind: 'certifications' };
    if (hasAny(t, ['faq', 'questions'])) return { kind: 'faq' };

    return { kind: 'general' };
}

export function generateResponse(userText, memory) {
    const intent = classifyIntent(userText);
    const t = lower(userText);

    if (intent.kind === 'unknownCommand') {
        return {
            blocks: [
                { type: 'text', text: `Unknown command: ${intent.cmd}\n\nTry: ${commandList.join('  ')}` }
            ],
            followups: makeFollowups(['/about', '/skills', '/projects', '/contact'])
        };
    }

    if (intent.kind === 'command') {
        switch (intent.cmd) {
            case '/about':
            case '/education':
            case '/experience':
                return aboutResponse();
            case '/skills':
                return skillsResponse();
            case '/projects':
                return projectsResponse();
            case '/certifications':
                return certificationsResponse();
            case '/goals':
                return goalsResponse();
            case '/services':
                return servicesResponse();
            case '/contact':
                return { blocks: [{ type: 'text', text: 'Here are the best ways to reach Toluwanimi:' }, formatContact()] };
            case '/faq':
                return faqResponse();
            case '/resume':
                return resumeResponse();
            default:
                return aboutResponse();
        }
    }

    if (intent.kind === 'contact') {
        return {
            blocks: [
                { type: 'text', text: `Here\u2019s how to contact ${profile.shortName}:` },
                formatContact()
            ],
            followups: makeFollowups(['Is he available for internships?', '/projects', '/skills', '/services'])
        };
    }

    if (intent.kind === 'availability') return availabilityResponse();
    if (intent.kind === 'skills') return skillsResponse();

    if (intent.kind === 'projects') {
        if (t.includes('frontend')) return projectsResponse('frontend');
        if (hasAny(t, ['food', 'restaurant', 'menu'])) return projectsResponse('food');
        if (t.includes('nexora')) return projectsResponse(null);
        return projectsResponse();
    }

    if (intent.kind === 'about') return aboutResponse();
    if (intent.kind === 'certifications') return certificationsResponse();
    if (intent.kind === 'goals') return goalsResponse();
    if (intent.kind === 'services') return servicesResponse();
    if (intent.kind === 'faq') return faqResponse();

    // Smart fallback with light personalization
    const lastTopic = memory?.lastTopic || null;
    const fallbackText =
        `I can help with ${profile.shortName}\u2019s background, skills, projects, services, and contact info.\n\n` +
        `Try asking:\n` +
        `- "What skills does he have?"\n` +
        `- "Show frontend projects"\n` +
        `- "How can I contact him?"\n\n` +
        (lastTopic ? `You were recently talking about: ${lastTopic}. Want to continue there?` : '');

    return {
        blocks: [{ type: 'text', text: fallbackText }],
        followups: makeFollowups(['/skills', '/projects', '/contact', '/about'])
    };
}

export function makeMessage({ role, blocks, text }) {
    return {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        role,
        time: nowTime(),
        text: text || null,
        blocks: blocks || (text ? [{ type: 'text', text }] : [])
    };
}
