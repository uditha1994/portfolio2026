const gh = (repo: string) => `https://github.com/uditha1994/${repo}`

export const profile = {
  name: 'Uditha Landekumbura',
  roles: ['Lecturer & Program Manager', 'Full-Stack Engineer', 'AI, Robotics & IoT Researcher'],
  location: 'Sri Lanka',
  coords: '6.9271° N  79.8612° E',
  email: 'uditha@programmer.net',
  github: 'https://github.com/uditha1994',
  linkedin: 'https://www.linkedin.com/in/uditha94/',
  blog: '',
  headline: ['I teach computer science.', 'I build the software I teach.'],
  about:
    'I am a Lecturer and Program Manager at the Management and Science Institute in Colombo, where I deliver modules across the Computer Science diploma and degree programmes. Alongside teaching, I bring more than six years of full-stack engineering experience, delivering web applications end to end, from requirements through to deployment. I also design and run hands-on technology workshops in robotics, IoT and practical programming for school and university students.',
  quote: 'The best way to learn a thing properly is to have to explain it to thirty people on a Monday morning.',
  contact:
    'Open to lecturing, curriculum and workshop collaborations, and to full-stack engineering projects.',
}

export const stats = [
  { n: 6, suffix: '+', label: 'years of full-stack engineering' },
  { n: 15, suffix: '+', label: 'technology workshops delivered' },
  { n: 200, suffix: '+', label: 'students trained across 8+ schools and institutes' },
  { n: 100, suffix: '+', label: 'public repositories on GitHub' },
]

export const experience = [
  {
    role: 'Lecturer',
    org: 'Management and Science Institute',
    place: 'Colombo, Sri Lanka',
    period: 'Apr 2026 – Present',
    points: [
      'Deliver modules across the Computer Science diploma and degree programmes, including Programming Languages, OOP Concepts, Research Methodology, Natural Language Processing and E-Commerce.',
      'Design course material, practical sessions and assessments, and supervise student projects through to submission.',
      'Coach the institute’s competitive programming team for ICPC Sri Lanka, and run the Faculty of Computing’s student ICT club.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'FullStack Craft',
    place: 'Kandy, Sri Lanka',
    period: 'Mar 2020 – Apr 2026',
    points: [
      'Built and maintained full-stack web applications in Java and Spring Boot with React and Angular front ends, backed by MySQL.',
      'Took features through the full lifecycle: requirements, design, implementation, testing and deployment.',
      'Contributed to the team’s published products, including a Chrome extension and browser-based games.',
    ],
  },
  {
    role: 'Lecturer',
    org: 'IBA Campus',
    place: 'Kandy, Sri Lanka',
    period: 'Oct 2024 – Jan 2026',
    points: [
      'Lectured on Computer Science and Software Engineering modules for diploma and degree students.',
      'Prepared lecture material, practical exercises and assessments for 8+ modules, and supervised student projects.',
    ],
  },
  {
    role: 'IT Instructor',
    org: 'JMC School of Computing',
    place: 'Kandy, Sri Lanka',
    period: 'Mar 2024 – Oct 2024',
    points: [
      'Taught IT diploma and certificate programmes to 100+ students in classroom and laboratory sessions.',
      'Built practical exercises that took beginners from no programming background to working applications.',
    ],
  },
]

export const education = [
  { title: 'Bachelor’s degree, Computer Software Engineering', org: 'Java Institute for Advanced Technology', period: '2017 – 2021' },
  { title: 'GCE Advanced Level, Bio Science', org: 'Badulla Central College', period: '2011 – 2014' },
]

export const certifications = [
  'CoDeKu Certified GCP 101',
  'Crash Course: AWS Basics',
  'Introduction to Generative AI',
  'Introduction to Responsible AI',
  'KodeKloud Engineer – Git (Level 1)',
]

export const skills = ['Program Management', 'Team Leadership', 'University Lecturing']

export const teaches = ['Programming Fundamentals', 'Web Technologies & Frameworks', 'Research Methodology', 'Natural Language Processing', 'E-Commerce']

export const classroom = [
  { topic: 'MVC and layered architecture', repos: ['sahana-health', 'CRUD_with_Layered_Architecrure'] },
  { topic: 'Design patterns and SOLID', repos: ['coffee_shop_design_patterns', 'SOLID_Practice'] },
  { topic: 'REST API design', repos: ['mobile_pos_api', 'bitedash_backend'] },
  { topic: 'Spring Boot and Java', repos: ['spring-crudoperation', 'SpringDemo'] },
  { topic: 'JavaScript fundamentals', repos: ['quizapp-js', 'weather-application-js'] },
  { topic: 'React basics', repos: ['registration-with-react', 'simple-blog-react'] },
  { topic: 'E-commerce development', repos: ['Ecomm_2024June', 'ceyloncart-front-webapp'] },
  { topic: 'IoT with ESP8266', repos: ['smart_room_control', 'room-visitor-monitor'] },
].map((c) => ({ ...c, repos: c.repos.map((r) => ({ name: r, url: gh(r) })) }))

export const loop = [
  {
    n: '01',
    title: 'Teach',
    body: 'Each module is taught through a working system. The MVC module, for example, is delivered by building sahana-health live in a ninety-minute session.',
    tag: 'sahana-health',
    url: gh('sahana-health'),
  },
  {
    n: '02',
    title: 'Publish',
    body: 'Every reference implementation is kept public, so students and other developers can study the code behind the lecture.',
    tag: 'github.com/uditha1994',
    url: 'https://github.com/uditha1994',
  },
  {
    n: '03',
    title: 'Deploy',
    body: 'Real problems on campus become production software. msi-signage now runs the campus Smart TV displays: daily timetables, lecturer profiles, Excel import and a meeting mode.',
    tag: 'msi-signage',
    url: gh('msi-signage'),
  },
  {
    n: '04',
    title: 'Refine',
    body: 'Finished projects return to the classroom as workshop material, and the lessons learned feed into the following year’s syllabus.',
    tag: 'ravana-yuddaya',
    url: gh('ravana-yuddaya'),
  },
]

export const now = [
  { k: 'Studying', v: 'Google Cloud Generative AI Leader certification, with a published study roadmap' },
  { k: 'Coaching', v: 'A student team preparing for the ICPC Sri Lanka regionals' },
  { k: 'Leading', v: 'STACK, the student-led ICT club at the Faculty of Computing' },
  { k: 'Building', v: 'Web and mobile applications, and 2D browser games' },
  { k: 'Training', v: 'Robotics and IoT workshops for school students, and AI tool training for teachers' },
]

export const work = [
  {
    title: 'Ceyrom',
    what: 'A browser-based Sri Lankan carrom game with single-player, local and online multiplayer modes. Available in English, Sinhala and Tamil.',
    stack: ['TypeScript', 'Vite', 'Node'],
    url: gh('ceyrom'),
  },
  {
    title: 'MSI Digital Signage',
    what: 'A digital signage system for campus Smart TVs, with daily timetables, lecturer profiles, Excel import and a meeting mode. Currently in use on campus.',
    stack: ['Python', 'Flask', 'Firebase'],
    url: gh('msi-signage'),
  },
  {
    title: 'Institute Management',
    what: 'An administration system for educational institutes, covering subjects, examinations and result processing.',
    stack: ['Laravel', 'PHP', 'MySQL'],
    url: gh('institute-management-laravel'),
  },
  {
    title: 'BiteDash',
    what: 'A food ordering platform built as a REST API backend with a separate Angular client.',
    stack: ['Angular 17', 'Node', 'TypeScript'],
    url: gh('bitedash_frontend'),
  },
  {
    title: 'රාවණ යුද්ධය',
    lang: 'si',
    what: 'Ravana Yuddaya: a top-down shooter set across five historic Sri Lankan locations, inspired by local mythology.',
    stack: ['Vanilla JS', 'Canvas'],
    url: gh('ravana-yuddaya'),
  },
  {
    title: 'Gen AI Leader Roadmap',
    what: 'A seven-stage study roadmap for the Google Cloud Generative AI Leader certification, with progress tracked in the repository.',
    stack: ['Markdown', 'GitHub Actions'],
    url: gh('google-gen-ai-leader-roadmap'),
  },
]

export const stack = [
  { label: 'Languages', items: ['Java', 'JavaScript', 'TypeScript', 'PHP', 'Python'] },
  { label: 'Frameworks', items: ['Spring Boot', 'React', 'Angular', 'Node.js', 'Laravel', 'CodeIgniter', 'Tailwind CSS'] },
  { label: 'Data, infra, hardware', items: ['MySQL', 'MongoDB', 'Firebase', 'Git', 'ESP8266', 'Arduino'] },
]
