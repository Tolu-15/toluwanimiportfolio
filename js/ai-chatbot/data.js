export const profile = {
    name: 'Toluwanimi Babalola Olanrewaju',
    shortName: 'Toluwanimi',
    role: 'Front-End Developer',
    university: 'Covenant University',
    course: 'Industrial Mathematics (Computer Science)',
    location: 'Nigeria',
    experience: [
        { when: '2026 - Present', title: 'Engineering Intern (Engineering Team)', org: 'Cavista Technologies' },
        { when: 'March 2025', title: 'IT (Pre-IT Internship)', org: 'Micronet Technologies, Lagos, Nigeria' },
        { when: '2023 - Current', title: 'Learning Web Design', org: 'APTECH Abeokuta' }
    ],
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
        portfolio: 'https://toluwanimibabalolasportfolio.netlify.app/',
        resume: 'assets/docs/cv.pdf'
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
            tagline: 'Recruitment & project portal',
            description: 'A recruitment and project portal with a sleek UI, Lottie motion, and an automated onboarding form.',
            tags: ['Frontend', 'UI', 'Forms'],
            ctas: [
                { label: 'View Live', href: 'https://nexoratel.netlify.app/' }
            ]
        },
        {
            key: 'scholarsdrip',
            name: 'ScholarsDrip',
            tagline: 'Educational platform',
            description: 'An educational platform that gives students quick, organised access to learning content.',
            tags: ['Frontend', 'Firebase', 'Education'],
            ctas: [
                { label: 'View Live', href: 'https://scholarsdrip.web.app/' }
            ]
        },
        {
            key: 'afthonia',
            name: 'Afthonia Foods',
            tagline: 'Food brand website',
            description: 'A responsive site built for a food brand, focused on clean layout and usability.',
            tags: ['Frontend', 'Landing Page', 'Food'],
            ctas: [
                { label: 'View Live', href: 'https://afthoniafooods.netlify.app/' }
            ]
        },
        {
            key: 'gracemark',
            name: 'Gracemark Result Hub',
            tagline: 'School results portal',
            description: 'A school portal that lets students check their results online in seconds.',
            tags: ['Frontend', 'Firebase', 'Education'],
            ctas: [
                { label: 'View Live', href: 'https://gracemarkacademyresulthub.web.app/' }
            ]
        }
    ],
    certifications: ['Web Development training at APTECH Abeokuta (in progress)'],
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
