export const profile = {
    name: 'Toluwanimi Babalola Olanrewaju',
    shortName: 'Toluwanimi',
    role: 'Front-End Developer',
    university: 'Covenant University',
    course: 'Industrial Mathematics (Computer Science)',
    location: 'Nigeria',
    experience: [
        { when: '2026 (completed)', title: 'Engineering Intern, Industrial Training (IT)', org: 'Cavista Technologies' },
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
        frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'JSX', 'Vite', 'Responsive UI', 'Accessibility'],
        backend: ['Supabase', 'Firebase'],
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
            ctas: [{ label: 'View Live', href: 'https://nexoratel.netlify.app/' }]
        },
        {
            key: 'gracemark-portal',
            name: 'Gracemark Portal',
            tagline: 'School web portal',
            description: 'The official web portal for Gracemark Academy, bringing school information and services into one place.',
            tags: ['Frontend', 'Education', 'Portal'],
            ctas: [{ label: 'View Live', href: 'https://www.gracemarkportal.com.ng/' }]
        },
        {
            key: 'quiz-hub',
            name: 'Gracemark Quiz Hub',
            tagline: 'CBT / online quiz platform',
            description: 'A computer-based testing platform where students take quizzes and exams online and get instant scores.',
            tags: ['Frontend', 'Education', 'CBT'],
            ctas: [{ label: 'View Live', href: 'https://cbt.gracemarkportal.com.ng/' }]
        },
        {
            key: 'exam-forge',
            name: 'Exam Forge',
            tagline: 'Exam builder',
            description: 'A tool for building and running exams, from setting questions to delivering tests and reviewing results.',
            tags: ['Frontend', 'Education'],
            ctas: []
        },
        {
            key: 'afthonia',
            name: 'Afthonia Foods',
            tagline: 'Food brand website',
            description: 'A responsive site built for a food brand, focused on clean layout and usability.',
            tags: ['Frontend', 'Landing Page', 'Food'],
            ctas: [{ label: 'View Live', href: 'https://afthoniafooods.netlify.app/' }]
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
