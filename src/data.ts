const gh = (repo: string) => `https://github.com/uditha1994/${repo}`

export const profile = {
  name: 'Uditha Landekumbura',
  roles: ['Lecturer', 'Software Engineer', 'Builder'],
  location: 'Colombo, Sri Lanka',
  coords: '6.9271° N  79.8612° E',
  email: 'uditha@programmer.net',
  github: 'https://github.com/uditha1994',
  linkedin: 'https://www.linkedin.com/in/uditha94/',
  blog: 'https://fullstackcraft.dev/',
  about:
    'I sit on both sides of the desk. By day I am a Lecturer and Program Manager at the Management and Science Institute in Sri Lanka, teaching Computer Science diploma and degree students. The rest of the time I am a software engineer shipping real systems. Almost nothing here is a portfolio piece built to be looked at. The teaching and the engineering feed each other.',
  quote: 'The best way to learn a thing properly is to have to explain it to thirty people on a Monday morning.',
  contact:
    'Open to collaborations on education technology, student projects worth taking further, and freelance work that is a genuine fit.',
}

export const stats = [
  { n: 102, label: 'public repositories' },
  { n: 2019, label: 'on GitHub since', plain: true },
  { n: 8, label: 'modules with open reference code' },
  { n: 3, label: 'languages in one game: EN · සිං · தமிழ்' },
]

export const affiliations = [
  { k: 'Lecturer & Program Manager', v: 'Management and Science Institute (MSI), Sri Lanka' },
  { k: 'Software Engineer', v: 'Red Vulture Innovations' },
  { k: 'Coach', v: 'ICPC Sri Lanka regionals team' },
  { k: 'Runs', v: 'STACK, the student led ICT club at MSI Faculty of Computing' },
]

export const teaches = ['Computer Science', 'Research Methodology', 'Natural Language Processing', 'E-Commerce']

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
    title: 'Teach the module',
    body: 'A module on MVC does not stay on slides. It becomes sahana-health, written live in front of the class in ninety minutes.',
    tag: 'sahana-health',
    url: gh('sahana-health'),
  },
  {
    n: '02',
    title: 'Publish the build',
    body: 'Every reference implementation stays public, so students and anyone else can read the code behind the lecture.',
    tag: 'github.com/uditha1994',
    url: 'https://github.com/uditha1994',
  },
  {
    n: '03',
    title: 'Ship it for real',
    body: 'A timetable problem on campus becomes msi-signage. It now runs on the Smart TVs: daily timetable, lecturer photos, Excel import, meeting mode.',
    tag: 'msi-signage',
    url: gh('msi-signage'),
  },
  {
    n: '04',
    title: 'Take it back to class',
    body: 'A browser game becomes the material for a two hour workshop. Then all of it goes back into next year’s syllabus.',
    tag: 'ravana-yuddaya',
    url: gh('ravana-yuddaya'),
  },
]

export const now = [
  { k: 'Studying', v: 'Google Cloud Generative AI Leader certification, with the roadmap published' },
  { k: 'Coaching', v: 'A student team for the ICPC Sri Lanka regionals' },
  { k: 'Running', v: 'STACK, the student led ICT club' },
  { k: 'Building', v: 'Browser games with a Sri Lankan setting, used as workshop material' },
  { k: 'Teaching', v: 'Robotics and IoT workshops for school students, AI tool training for teachers' },
]

export const work = [
  {
    title: 'Ceyrom',
    what: 'Sri Lankan carrom in the browser. Play the computer, play on one screen, or play online. Trilingual: English, Sinhala, Tamil.',
    stack: ['TypeScript', 'Vite', 'Node'],
    url: gh('ceyrom'),
  },
  {
    title: 'MSI Digital Signage',
    what: 'Campus signage running on Smart TVs: daily timetable, lecturer photos, Excel import, meeting mode. In use on campus.',
    stack: ['Python', 'Flask', 'Firebase'],
    url: gh('msi-signage'),
  },
  {
    title: 'Institute Management',
    what: 'Administration system for an institute: subjects, exams and result processing.',
    stack: ['Laravel', 'PHP', 'MySQL'],
    url: gh('institute-management-laravel'),
  },
  {
    title: 'BiteDash',
    what: 'Food ordering platform, built as a separate API backend and an Angular client.',
    stack: ['Angular 17', 'Node', 'TypeScript'],
    url: gh('bitedash_frontend'),
  },
  {
    title: 'රාවණ යුද්ධය',
    lang: 'si',
    what: 'Ravana Yuddaya. A top down shooter across five historic Sri Lankan locations, drawn from local mythology.',
    stack: ['Vanilla JS', 'Canvas'],
    url: gh('ravana-yuddaya'),
  },
  {
    title: 'Gen AI Leader Roadmap',
    what: 'A seven stage, self tracked study roadmap for the Google Cloud certification. The repo is the progress tracker.',
    stack: ['Markdown', 'GitHub Actions'],
    url: gh('google-gen-ai-leader-roadmap'),
  },
]

export const stack = [
  { label: 'Languages', items: ['Java', 'JavaScript', 'TypeScript', 'PHP', 'Python'] },
  { label: 'Frameworks', items: ['Spring Boot', 'React', 'Angular', 'Node.js', 'Laravel', 'CodeIgniter'] },
  { label: 'Data, infra, hardware', items: ['MySQL', 'MongoDB', 'Firebase', 'Git', 'ESP8266', 'Arduino'] },
]
