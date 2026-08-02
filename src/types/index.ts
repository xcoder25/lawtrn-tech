export type ProjectStatus =
  | 'Idea'
  | 'Research'
  | 'Prototype'
  | 'Development'
  | 'Testing'
  | 'Completed';

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string; // rich text HTML
  category: string;
  status: ProjectStatus;
  coverImage: string;
  gallery?: string[];
  teamIds: string[];
  milestones: { id: string; label: string; done: boolean; date?: string }[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchPublication {
  id: string;
  title: string;
  slug: string;
  category: string;
  abstract: string;
  contributors: string[]; // team member ids or external names
  references: string[];
  documentUrl?: string; // Firebase Storage URL
  published: boolean;
  publishedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  type: 'blog' | 'news' | 'announcement';
  excerpt: string;
  content: string; // rich text HTML
  coverImage: string;
  authorId: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  track: 'Robotics' | 'AI' | 'Programming' | 'Electronics';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  lessons: { id: string; title: string; videoUrl?: string; durationMin: number }[];
  learningPathId?: string;
  published: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: 'Event' | 'Workshop' | 'Volunteer';
  description: string;
  date: string;
  location: string;
  registrationOpen: boolean;
  registeredCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  photoUrl: string;
  skills: string[];
  linkedinUrl?: string;
  order: number;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'collaboration';
  createdAt: string;
  read: boolean;
}

export interface DashboardStats {
  totalVisitors: number;
  totalCommunityMembers: number;
  totalProjects: number;
  totalResearch: number;
  totalPosts: number;
  totalTeamMembers: number;
}
