// Demo content only — used as a fallback so pages have something to render
// before real content is published in Firestore. Safe to delete once the
// admin dashboard has real projects, posts, and team members saved.
import type { Project, ResearchPublication, Post, TeamMember, CommunityEvent, Course } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Agri-Sense Field Robot',
    slug: 'agri-sense-field-robot',
    summary: 'An autonomous ground robot that scouts crop rows for pest stress and soil moisture.',
    description: '',
    category: 'Robotics',
    status: 'Prototype',
    coverImage: '/assets/projects/agri-sense.jpg',
    teamIds: ['1', '2'],
    milestones: [
      { id: 'm1', label: 'Chassis + drivetrain', done: true },
      { id: 'm2', label: 'Multispectral sensor rig', done: true },
      { id: 'm3', label: 'Field trial — Rivers State', done: false },
    ],
    featured: true,
    createdAt: '2026-02-01',
    updatedAt: '2026-06-10',
  },
  {
    id: '2',
    title: 'Lawtronic Vision Kit',
    slug: 'lawtronic-vision-kit',
    summary: 'An affordable computer-vision starter kit for STEM classrooms across Nigeria.',
    description: '',
    category: 'AI & Education',
    status: 'Development',
    coverImage: '/assets/projects/vision-kit.jpg',
    teamIds: ['3'],
    milestones: [
      { id: 'm1', label: 'Curriculum draft', done: true },
      { id: 'm2', label: 'Hardware BOM finalized', done: false },
    ],
    featured: true,
    createdAt: '2026-03-14',
    updatedAt: '2026-07-01',
  },
  {
    id: '3',
    title: 'Grid-Watch Automation Node',
    slug: 'grid-watch-automation-node',
    summary: 'Low-cost sensor node for monitoring transformer load on informal micro-grids.',
    description: '',
    category: 'Automation',
    status: 'Research',
    coverImage: '/assets/projects/grid-watch.jpg',
    teamIds: ['2'],
    milestones: [{ id: 'm1', label: 'Literature review', done: true }],
    featured: false,
    createdAt: '2026-05-02',
    updatedAt: '2026-05-20',
  },
];

export const mockResearch: ResearchPublication[] = [
  {
    id: '1',
    title: 'Low-Cost Multispectral Sensing for Smallholder Agriculture',
    slug: 'low-cost-multispectral-sensing',
    category: 'Agritech',
    abstract:
      'We evaluate a sub-$40 multispectral sensor stack against commercial NDVI equipment across three field sites.',
    contributors: ['Dr. A. Eze', 'T. Wobo'],
    references: [],
    published: true,
    publishedAt: '2026-05-12',
  },
  {
    id: '2',
    title: 'Edge Inference on Sub-$10 Microcontrollers for Classroom Robotics',
    slug: 'edge-inference-classroom-robotics',
    category: 'AI Systems',
    abstract:
      'A benchmark of quantized vision models running on classroom-grade microcontrollers for STEM kits.',
    contributors: ['C. Amadi'],
    references: [],
    published: true,
    publishedAt: '2026-06-30',
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Lawtronic Joins the Pan-African Robotics Network',
    slug: 'pan-african-robotics-network',
    type: 'news',
    excerpt: 'We are now an affiliate member, opening new collaboration and funding pathways.',
    content: '',
    coverImage: '/assets/blog/parn.jpg',
    authorId: '1',
    tags: ['Partnerships'],
    published: true,
    publishedAt: '2026-07-18',
  },
  {
    id: '2',
    title: 'Inside the Vision Kit: Choosing a Camera Module Under $5',
    slug: 'vision-kit-camera-module',
    type: 'blog',
    excerpt: 'A breakdown of the tradeoffs that led us to the OV2640 for our classroom kit.',
    content: '',
    coverImage: '/assets/blog/camera-module.jpg',
    authorId: '3',
    tags: ['Hardware', 'Education'],
    published: true,
    publishedAt: '2026-07-05',
  },
];

export const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Adaeze Eze',
    role: 'Founder & Lead Roboticist',
    department: 'Robotics',
    bio: 'Leads Lawtronic\u2019s robotics division, focused on field-deployable autonomous systems.',
    photoUrl: '/assets/team/adaeze.jpg',
    skills: ['Robotics', 'Controls', 'Firmware'],
    order: 1,
  },
  {
    id: '2',
    name: 'Tamuno Wobo',
    role: 'Automation Engineer',
    department: 'Automation',
    bio: 'Builds low-cost sensing and automation hardware for energy and agriculture.',
    photoUrl: '',
    skills: ['Embedded Systems', 'IoT'],
    order: 2,
  },
  {
    id: '3',
    name: 'Chidera Amadi',
    role: 'Head of AI & Education',
    department: 'AI',
    bio: 'Designs STEM curriculum and AI tooling for classrooms across Nigeria.',
    photoUrl: '',
    skills: ['Machine Learning', 'Curriculum Design'],
    order: 3,
  },
];

export const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Robotics for Beginners — Weekend Workshop',
    type: 'Workshop',
    description: 'A hands-on introduction to microcontrollers and simple robots for ages 14+.',
    date: '2026-08-16',
    location: 'Port Harcourt, Rivers State',
    registrationOpen: true,
    registeredCount: 42,
  },
  {
    id: '2',
    title: 'Volunteer Mentors Needed — STEM Outreach',
    type: 'Volunteer',
    description: 'Support our school outreach program with weekly mentoring sessions.',
    date: '2026-09-01',
    location: 'Remote / On-site',
    registrationOpen: true,
    registeredCount: 11,
  },
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Intro to Robotics with Microcontrollers',
    slug: 'intro-robotics-microcontrollers',
    track: 'Robotics',
    level: 'Beginner',
    description: 'Build your first line-following robot while learning embedded C fundamentals.',
    lessons: [
      { id: 'l1', title: 'What is a microcontroller?', durationMin: 12 },
      { id: 'l2', title: 'Reading a sensor', durationMin: 18 },
    ],
    published: true,
  },
  {
    id: '2',
    title: 'Practical Machine Learning for Makers',
    slug: 'practical-ml-for-makers',
    track: 'AI',
    level: 'Intermediate',
    description: 'Train and deploy a simple image classifier to an edge device.',
    lessons: [{ id: 'l1', title: 'Collecting a dataset', durationMin: 15 }],
    published: true,
  },
];
