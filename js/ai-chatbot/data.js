export const profile = {
    name: 'Toluwanimi Babalola Olanrewaju',
    shortName: 'Toluwanimi',
    role: 'Front-End Developer',
    university: 'Covenant University',
    course: 'Industrial Mathematics (Computer Science)',
    location: 'Nigeria',
    availability: {
        internships: true,
        freelance: true,
        collaborations: true
    },
    links: {
        github: 'https://github.com/tolu-15',
        linkedin: 'https://www.linkedin.com/in/toluwanimi-babalola-b53076382/',
        email: 'toluwanimibabalola2707@gmail.com',
        phone: '+2349078828095',
        portfolio: 'https://toluwanimibabalolasportfolio.netlify.app/'
    },
    skills: {
        frontend: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'Accessibility', 'Performance'],
        uiux: ['UI design basics', 'Landing pages', 'Design systems mindset'],
        cybersecurity: ['Fundamentals', 'Security awareness', 'Best practices'],
        programming: ['JavaScript', 'Python (fundamentals)', 'Java (basics)', 'Node.js (fundamentals)', 'React (basic)']
    },
    projects: [
        {
            key: 'nexora',
            name: 'Nexora Tel',
            tagline: 'Contact & business onboarding experience',
            description: 'A modern contact/work-with-me funnel with strong UI polish and form automation.',
            tags: ['Frontend', 'UI', 'Forms'],
            ctas: [
                { label: 'Contact', href: '#contact' }
            ]
        },
        {
            key: 'afthonia',
            name: 'Afthonia Foods',
            tagline: 'Restaurant/food business web experience',
            description: 'A responsive site built for a food brand, focused on clean layout and usability.',
            tags: ['Frontend', 'Landing Page', 'Food'],
            ctas: [
                { label: 'View Live', href: 'https://afthoniafooods.netlify.app/' }
            ]
        }
    ],
    certifications: ['In progress — building a strong portfolio and continuous learning'],
    goals: [
        'Secure internship opportunities and grow industry experience',
        'Build premium UI systems and scalable frontend components',
        'Expand into cybersecurity and full-stack capabilities'
    ],
    hobbies: ['Learning new tech', 'Building UI', 'Exploring cybersecurity', 'Personal growth'],
    services: ['Front-End Development', 'UI/UX Design', 'Landing Page Builds'],
    faq: [
        {
            q: 'Is Toluwanimi available for internships?',
            a: 'Yes — available for internships, freelance work, and collaborations.'
        },
        {
            q: 'How can I reach him fast?',
            a: 'Email or phone works best. LinkedIn is also open for professional messages.'
        }
    ]
};

export const promptChips = [
    'Tell me about Toluwanimi',
    'What projects has he built?',
    'What skills does he have?',
    'Show frontend projects',
    'What is Nexora Tel?',
    'How can I contact him?',
    'Is he available for internships?',
    'Show certifications',
    'Download resume'
];

export const commands = [
    '/about',
    '/skills',
    '/projects',
    '/education',
    '/experience',
    '/certifications',
    '/goals',
    '/services',
    '/contact',
    '/faq',
    '/resume'
];
