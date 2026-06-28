const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const DEFAULT_TECH_STACK = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Ruby', 'Scala', 'R', 'Julia', 'MATLAB', 'SQL', 'Bash', 'PowerShell', 'Lua', 'Perl', 'Elixir', 'Haskell', 'Objective-C', 'Assembly', 'Visual Basic', 'Groovy', 'F#',
  // Frontend
  'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Ant Design', 'shadcn/ui', 'Radix UI', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'SvelteKit', 'Astro', 'Remix', 'Gatsby', 'SolidJS', 'Alpine.js', 'jQuery',
  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Fastify', 'Django', 'Flask', 'FastAPI', 'Laravel', 'Symfony', 'CodeIgniter', 'Spring Boot', 'ASP.NET Core', 'Ruby on Rails', 'Phoenix', 'Gin', 'Fiber',
  // Mobile Development
  'Flutter', 'React Native', 'SwiftUI', 'UIKit', 'Jetpack Compose', 'Ionic', 'Capacitor', 'Native Android', 'Native iOS', 'Xamarin', '.NET MAUI',
  // Databases
  'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'Microsoft SQL Server', 'Oracle Database', 'MongoDB', 'Firebase Firestore', 'Redis', 'Cassandra', 'CouchDB', 'DynamoDB', 'Neo4j', 'Elasticsearch', 'ArangoDB', 'RavenDB', 'Supabase', 'Firebase', 'Appwrite', 'PocketBase', 'NeonDB',
  // Cloud & Infrastructure
  'AWS', 'Google Cloud Platform', 'Microsoft Azure', 'DigitalOcean', 'Cloudflare', 'Vercel', 'Netlify', 'Railway', 'Fly.io', 'Render', 'Heroku',
  // DevOps & Containers
  'Docker', 'Docker Compose', 'Kubernetes', 'Helm', 'Terraform', 'Ansible', 'Nginx', 'Apache', 'Traefik',
  // APIs & Integrations
  'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'OpenAPI', 'Stripe API', 'Firebase Authentication', 'OAuth', 'JWT',
  // ORMs
  'Prisma', 'Drizzle ORM', 'Sequelize', 'TypeORM', 'MikroORM', 'Mongoose'
];

const DEFAULT_TOOLS_USED = [
  // UI/UX Design
  'Figma', 'FigJam', 'Adobe XD', 'Sketch', 'Framer', 'InVision', 'Miro', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe After Effects', 'Adobe Premiere Pro', 'Adobe Lightroom', 'Canva', 'Blender',
  // AI Tools
  'ChatGPT', 'GitHub Copilot', 'Claude', 'Google Gemini', 'Microsoft Copilot', 'Cursor AI', 'Windsurf AI', 'Perplexity AI', 'v0', 'Bolt.new', 'Lovable', 'Replit AI', 'Codeium', 'Tabnine', 'Amazon CodeWhisperer', 'Continue.dev', 'Ollama', 'LM Studio', 'Stable Diffusion', 'Midjourney', 'DALL·E', 'Leonardo AI', 'Runway ML',
  // IDEs & Code Editors
  'Visual Studio Code', 'Visual Studio', 'Cursor', 'Windsurf', 'IntelliJ IDEA', 'WebStorm', 'PyCharm', 'PhpStorm', 'Rider', 'CLion', 'GoLand', 'Android Studio', 'Xcode', 'Eclipse', 'NetBeans', 'Sublime Text', 'Vim', 'Neovim', 'Notepad++', 'Zed',
  // Version Control
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps',
  // DevOps & Deployment
  'Docker Desktop', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI', 'Azure Pipelines', 'AWS CodePipeline', 'Vercel', 'Netlify', 'Railway', 'Render', 'DigitalOcean', 'Cloudflare Pages',
  // API Development
  'Postman', 'Insomnia', 'Swagger', 'Bruno', 'Hoppscotch',
  // Testing & QA
  'Cypress', 'Playwright', 'Selenium', 'Jest', 'Vitest', 'Mocha', 'Jasmine', 'PHPUnit', 'JUnit', 'TestRail', 'BrowserStack', 'LambdaTest', 'Katalon Studio',
  // Database Tools
  'pgAdmin', 'DBeaver', 'MongoDB Compass', 'MySQL Workbench', 'TablePlus', 'DataGrip', 'phpMyAdmin', 'RedisInsight', 'Studio 3T',
  // Collaboration & Project Management
  'Notion', 'Jira', 'Trello', 'ClickUp', 'Asana', 'Monday.com', 'Linear', 'Slack', 'Microsoft Teams', 'Discord', 'Confluence',
  // Monitoring & Analytics
  'Grafana', 'Prometheus', 'Sentry', 'LogRocket', 'Google Analytics', 'Hotjar', 'Mixpanel', 'Datadog', 'New Relic'
];

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Clearing database tables...');
  await prisma.project.deleteMany();
  await prisma.techOption.deleteMany();
  await prisma.toolOption.deleteMany();

  console.log('Seeding Tech options...');
  for (const name of DEFAULT_TECH_STACK) {
    await prisma.techOption.create({ data: { name } });
  }

  console.log('Seeding Tool options...');
  for (const name of DEFAULT_TOOLS_USED) {
    await prisma.toolOption.create({ data: { name } });
  }

  const getPastDate = (monthsAgo, dayOffset = 0) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    if (dayOffset !== 0) {
      d.setDate(d.getDate() - dayOffset);
    }
    return d;
  };

  const projectsData = [
    {
      name: 'Educational Institution Management System (EIMS)',
      description: '<p>Centralized hub to manage student enrollment, grading, course curation, billing, and parental notifications.</p>',
      type: 'Website Design',
      projectType: 'UI/UX Design',
      status: 'Ready for Deployment',
      priority: 'Critical',
      effort: 'XL',
      device: 'Desktop',
      creatorName: 'Raisul R.',
      company: 'MNTech Digital',
      startDate: '2026-01-10',
      endDate: '2026-05-15',
      deadline: '2026-06-30',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      previewLink: 'https://figma.com/design/eims-design-mockup',
      shortOverview: '<p>All-in-one institutional management portal to digitize administrative operations and grading workflows.</p>',
      businessGoal: '<p>Improve operational efficiency, eliminate paper billing, and establish transparent online parental reports.</p>',
      targetAudience: '<p>College Administrators, Teachers, and Staff.</p>',
      competitors: '<p>PowerSchool, Blackbaud, Fedena</p>',
      tags: ['ERP', 'School Management', 'Web Portal', 'Education'],
      techStack: ['Figma', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      toolsUsed: ['Figma', 'Visual Studio Code', 'GitHub', 'Postman', 'Vercel', 'Notion', 'Sentry'],
      industry: 'Education',
      createdAt: getPastDate(5, 5),
    },
    {
      name: 'EIMS Student Portal Mobile App',
      description: '<p>Mobile companion app for students to keep track of schedules, view grades, and check attendance in real-time.</p>',
      type: 'Android Application',
      projectType: 'Mobile App Development',
      status: 'In Progress',
      priority: 'High',
      effort: 'L',
      device: 'Mobile',
      creatorName: 'Sajid A.',
      company: 'MNTech Digital',
      startDate: '2026-02-15',
      deadline: '2026-07-20',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Dedicated Android application supporting real-time academic calendar notifications and homework submissions.</p>',
      tags: ['Android', 'EdTech', 'App', 'Students'],
      techStack: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
      toolsUsed: ['Android Studio', 'Figma', 'GitHub', 'GitLab CI/CD', 'ChatGPT', 'Postman'],
      industry: 'Education',
      createdAt: getPastDate(4, 12),
    },
    {
      name: 'EIMS Teacher Grading Panel',
      description: '<p>A highly interactive dashboard designed for educators to easily submit report card grades and log student attendance.</p>',
      type: 'Dashboard',
      projectType: 'Web Development',
      status: 'Review',
      priority: 'Medium',
      effort: 'M',
      device: 'Tablet',
      creatorName: 'Mahmud H.',
      company: 'MNTech Digital',
      startDate: '2026-03-01',
      endDate: '2026-05-30',
      deadline: '2026-06-25',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Responsive teacher dashboard layout with CSV grading exports and automated student progress flags.</p>',
      tags: ['Dashboard', 'React', 'Full-Stack', 'Teachers'],
      techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
      toolsUsed: ['Visual Studio Code', 'GitHub', 'Postman', 'Jira', 'Slack'],
      industry: 'Education',
      createdAt: getPastDate(3, 8),
    },
    {
      name: 'Parent-Teacher Communication Hub',
      description: '<p>Cross-platform notification app allowing direct messaging, announcement broadcasts, and meeting schedulers.</p>',
      type: 'iOS Application',
      projectType: 'Mobile App Development',
      status: 'Planning',
      priority: 'Critical',
      effort: 'M',
      device: 'Mobile',
      creatorName: 'Fahim K.',
      company: 'MNTech Digital',
      startDate: '2026-04-01',
      deadline: '2026-08-15',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Dedicated push-notification engine for instant school notices and individual parent chat rooms.</p>',
      tags: ['iOS', 'Push Notifications', 'Real-time Chat', 'Parents'],
      techStack: ['React Native', 'TypeScript', 'Node.js', 'WebSocket', 'Firebase Firestore', 'Firebase Authentication'],
      toolsUsed: ['Xcode', 'Visual Studio Code', 'Git', 'Notion', 'Discord'],
      industry: 'Education',
      createdAt: getPastDate(2, 4),
    },
    {
      name: 'Barisal College Public Website',
      description: '<p>A modern, responsive public relations website presenting courses, faculty profiles, and admission guidelines.</p>',
      type: 'Website Design',
      projectType: 'Web Development',
      status: 'Completed',
      priority: 'Low',
      effort: 'S',
      device: 'Desktop',
      creatorName: 'Nabila S.',
      company: 'MNTech Digital',
      startDate: '2026-01-05',
      endDate: '2026-02-28',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      previewLink: 'https://bhec.edu.bd',
      shortOverview: '<p>Public admission website featuring virtual campus tours and SEO-optimized search for degree programs.</p>',
      tags: ['Website', 'SEO', 'Tailwind', 'Nextjs'],
      techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Astro', 'Prisma', 'PostgreSQL'],
      toolsUsed: ['Figma', 'Visual Studio Code', 'GitHub', 'Vercel', 'Google Analytics'],
      industry: 'Education',
      createdAt: getPastDate(5, 20),
    },
    {
      name: 'EIMS Automated Fee Payment Gateway',
      description: '<p>Integrating local payment channels (bKash, Nagad, SSLCommerz) to collect tuition fees and generate digital invoices.</p>',
      type: 'API Integration',
      projectType: 'Web Development',
      status: 'In Testing',
      priority: 'Critical',
      effort: 'L',
      device: 'All',
      creatorName: 'Anik D.',
      company: 'MNTech Digital',
      startDate: '2026-05-01',
      deadline: '2026-07-05',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Automated billing microservice that emails PDF receipts to parents immediately upon bKash checkout.</p>',
      tags: ['Fintech', 'bKash', 'Nagad', 'API Integration'],
      techStack: ['Node.js', 'Express.js', 'TypeScript', 'REST API', 'PostgreSQL', 'Stripe API', 'JWT'],
      toolsUsed: ['Visual Studio Code', 'Postman', 'GitHub', 'Sentry', 'Docker Desktop'],
      industry: 'Finance',
      createdAt: getPastDate(1, 2),
    },
    {
      name: 'Executive Analytics System',
      description: '<p>Business intelligence dashboards to monitor enrollment stats, profit margins, and departmental budgets.</p>',
      type: 'Dashboard',
      projectType: 'Web Development',
      status: 'Research',
      priority: 'High',
      effort: 'XL',
      device: 'Desktop',
      creatorName: 'Raisul R.',
      company: 'MNTech Digital',
      startDate: '2026-01-01',
      deadline: '2026-06-01',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Interactive charts and forecasting algorithms displaying school financial health metrics to the board of directors.</p>',
      tags: ['Analytics', 'Business Intelligence', 'Docker', 'Postgres'],
      techStack: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Nginx', 'HTML5', 'CSS3'],
      toolsUsed: ['PyCharm', 'GitHub', 'Docker Desktop', 'pgAdmin', 'Grafana', 'Prometheus'],
      industry: 'Education',
      createdAt: getPastDate(5, 28),
    },
    {
      name: 'EIMS Mobile Design System (DS)',
      description: '<p>Unified Figma components, variables, typography grids, and theme settings to accelerate mobile design.</p>',
      type: 'Mobile App UI Design',
      projectType: 'UI/UX Design',
      status: 'Completed',
      priority: 'Medium',
      effort: 'M',
      device: 'None',
      creatorName: 'Nabila S.',
      company: 'MNTech Digital',
      startDate: '2026-02-01',
      endDate: '2026-03-15',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      previewLink: 'https://figma.com/design/eims-mobile-ds',
      shortOverview: '<p>Standardized UI kit offering consistent buttons, input controls, and dark-mode styles.</p>',
      tags: ['Design System', 'Figma', 'UI Kit', 'Style Guide'],
      techStack: ['Tailwind CSS', 'Figma'],
      toolsUsed: ['Figma', 'FigJam', 'Miro'],
      industry: 'Software Development',
      createdAt: getPastDate(4, 1),
    },
    {
      name: 'EIMS Virtual Classroom Integration',
      description: '<p>Enabling direct virtual classroom calls, screen sharing, and audio board within the browser.</p>',
      type: 'API Integration',
      projectType: 'Web Development',
      status: 'Planning',
      priority: 'Important',
      effort: 'XL',
      device: 'Desktop',
      creatorName: 'Sajid A.',
      company: 'MNTech Digital',
      startDate: '2026-04-10',
      deadline: '2026-09-01',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Integrating live WebRTC video channels inside student course pages with whiteboard overlays.</p>',
      tags: ['WebRTC', 'Live Video', 'API', 'Interactive'],
      techStack: ['Node.js', 'Socket.io', 'WebSocket', 'JavaScript', 'HTML5', 'CSS3'],
      toolsUsed: ['Visual Studio Code', 'GitHub', 'Chrome DevTools', 'Postman'],
      industry: 'Education',
      createdAt: getPastDate(2, 15),
    },
    {
      name: 'EIMS Library Book Tracker',
      description: '<p>Cross-platform application built for tablets to scan library barcodes, log rentals, and automate return alerts.</p>',
      type: 'Cross-Platform Application',
      projectType: 'Mobile App Development',
      status: 'In Progress',
      priority: 'Low',
      effort: 'M',
      device: 'Tablet',
      creatorName: 'Mahmud H.',
      company: 'MNTech Digital',
      startDate: '2026-03-15',
      deadline: '2026-07-15',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Scan barcodes using device camera to instantly lookup books and log due dates.</p>',
      tags: ['Barcode Scanner', 'Library', 'Flutter', 'SQLite'],
      techStack: ['Flutter', 'Dart', 'SQLite', 'REST API'],
      toolsUsed: ['Android Studio', 'GitHub', 'Figma', 'Slack'],
      industry: 'Education',
      createdAt: getPastDate(3, 22),
    },
    {
      name: 'EIMS Identity Pack & Brand Logo',
      description: '<p>Design audit, typography guide, color palette definition, and vector icon collections for official branding.</p>',
      type: 'Branding',
      projectType: 'UI/UX Design',
      status: 'Completed',
      priority: 'Minor',
      effort: 'S',
      device: 'None',
      creatorName: 'Fahim K.',
      company: 'MNTech Digital',
      startDate: '2026-01-02',
      endDate: '2026-01-20',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Standardizing official brand identity, business cards, and customized vectors for EIMS marketing.</p>',
      tags: ['Logo', 'Branding', 'Vector Art', 'Illustrator'],
      techStack: ['Figma'],
      toolsUsed: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Canva'],
      industry: 'Marketing & Advertising',
      createdAt: getPastDate(5, 29),
    },
    {
      name: 'GraphQL API Gateway Infrastructure',
      description: '<p>High-performance federated graph API managing queries from both Web portals and Mobile client apps.</p>',
      type: 'API Integration',
      projectType: 'Web Development',
      status: 'Maintenance',
      priority: 'Urgent',
      effort: 'L',
      device: 'All',
      creatorName: 'Anik D.',
      company: 'MNTech Digital',
      startDate: '2026-05-10',
      deadline: '2026-06-15',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Apollo Federation setup to resolve database queries across student, teacher, and financial servers.</p>',
      tags: ['GraphQL', 'Apollo', 'Microservices', 'Infra'],
      techStack: ['TypeScript', 'Node.js', 'NestJS', 'GraphQL', 'PostgreSQL', 'Docker', 'Apollo'],
      toolsUsed: ['WebStorm', 'GitHub Actions', 'Postman', 'Datadog', 'Sentry'],
      industry: 'Information Technology',
      createdAt: getPastDate(1, 10),
    },
    {
      name: 'Interactive LMS Math Game',
      description: '<p>Gamified quizzes and mathematics puzzles inside the student app to encourage daily exercises.</p>',
      type: 'Mobile App UI Design',
      projectType: 'Mobile App Development',
      status: 'Ready for Deployment',
      priority: 'Medium',
      effort: 'M',
      device: 'Mobile',
      creatorName: 'Sajid A.',
      company: 'MNTech Digital',
      startDate: '2026-04-01',
      endDate: '2026-05-25',
      deadline: '2026-06-10',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>Gamified mathematics application with online leaderboards and customized achievement badges.</p>',
      tags: ['Gamification', 'Math', 'Unity', 'Kids Education'],
      techStack: ['Unity', 'C#', 'Firebase Firestore', 'Firebase Authentication'],
      toolsUsed: ['Blender', 'Visual Studio', 'GitHub', 'Claude', 'Figma'],
      industry: 'Education',
      createdAt: getPastDate(2, 28),
    },
    {
      name: 'Dockerized Local Environment Setup',
      description: '<p>Setting up Docker compose files and local databases to easily clone and run the EIMS environment locally.</p>',
      type: 'Software Development',
      projectType: 'Web Development',
      status: 'Completed',
      priority: 'Major',
      effort: 'S',
      device: 'None',
      creatorName: 'Anik D.',
      company: 'MNTech Digital',
      startDate: '2026-03-01',
      endDate: '2026-03-25',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>One-click local docker orchestration setup to stand up PostgreSQL, Redis, and API endpoints.</p>',
      tags: ['Docker', 'DevOps', 'Postgres', 'Local Dev'],
      techStack: ['Docker', 'Docker Compose', 'Bash', 'PostgreSQL', 'Redis'],
      toolsUsed: ['Docker Desktop', 'Visual Studio Code', 'GitHub', 'DBeaver', 'Slack'],
      industry: 'Software Development',
      createdAt: getPastDate(3, 10),
    },
    {
      name: 'EIMS User Journey Mapping & Audit',
      description: '<p>Comprehensive user research conducting usability tests and journey mapping for student admissions.</p>',
      type: 'User Research',
      projectType: 'UI/UX Design',
      status: 'Completed',
      priority: 'Important',
      effort: 'M',
      device: 'All',
      creatorName: 'Raisul R.',
      company: 'MNTech Digital',
      startDate: '2026-01-15',
      endDate: '2026-02-28',
      clientName: 'Barisal Home Economics College',
      clientEmail: 'bhec.edu.bd@gmail.com',
      clientPhone: '01870802690',
      clientAddress: 'College Road, Barisal, Bangladesh',
      shortOverview: '<p>User research documentation highlighting bottlenecks in student registrations and parent profile creations.</p>',
      tags: ['User Research', 'Audit', 'Journey Mapping', 'Usability'],
      techStack: ['Figma'],
      toolsUsed: ['Figma', 'FigJam', 'Miro', 'Notion', 'Confluence'],
      industry: 'Education',
      createdAt: getPastDate(5, 15),
    }
  ];

  console.log('Seeding projects...');
  for (const project of projectsData) {
    await prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
        type: project.type,
        projectType: project.projectType,
        status: project.status,
        priority: project.priority,
        effort: project.effort,
        device: project.device,
        creatorName: project.creatorName,
        company: project.company,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        deadline: project.deadline || '',
        clientName: project.clientName || '',
        clientEmail: project.clientEmail || '',
        clientPhone: project.clientPhone || '',
        clientAddress: project.clientAddress || '',
        previewLink: project.previewLink || '',
        shortOverview: project.shortOverview || '',
        businessGoal: project.businessGoal || '',
        targetAudience: project.targetAudience || '',
        competitors: project.competitors || '',
        tags: project.tags,
        techStack: project.techStack,
        toolsUsed: project.toolsUsed,
        industry: project.industry,
        createdAt: project.createdAt,
      }
    });
  }

  console.log('Seeding finished successfully.');
  await prisma.$disconnect();
  pool.end();
}

main().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
