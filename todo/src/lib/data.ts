export type UserRole = "Admin" | "Member";
export type TaskStatus = "Pending" | "In Progress" | "Pending Review" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  skills: string[];
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  performanceScore: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  projectId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedDate: string;
  assignedBy: string;
  attachments: number;
  comments: number;
}

export const users: User[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    role: "Member",
    designation: "Frontend Engineer",
    email: "alex.m@company.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/150?u=u1",
    joinDate: "2023-01-15",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    bio: "Passionate about building highly intuitive user interfaces.",
    githubUrl: "https://github.com",
    completedTasks: 45,
    pendingTasks: 3,
    inProgressTasks: 2,
    overdueTasks: 0,
    performanceScore: 92,
  },
  {
    id: "u2",
    name: "Samantha Lee",
    role: "Member",
    designation: "Backend Developer",
    email: "sam.lee@company.com",
    phone: "+1 (555) 987-6543",
    avatar: "https://i.pravatar.cc/150?u=u2",
    joinDate: "2022-11-01",
    skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
    bio: "Data enthusiast scaling up backend systems for high availability.",
    completedTasks: 38,
    pendingTasks: 5,
    inProgressTasks: 1,
    overdueTasks: 1,
    performanceScore: 88,
  },
  {
    id: "u3",
    name: "Marcus Johnson",
    role: "Member",
    designation: "UI/UX Designer",
    email: "marcus.j@company.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://i.pravatar.cc/150?u=u3",
    joinDate: "2024-02-10",
    skills: ["Figma", "Framer", "CSS", "Wireframing"],
    bio: "Designing clean and elegant user experiences.",
    completedTasks: 12,
    pendingTasks: 1,
    inProgressTasks: 1,
    overdueTasks: 0,
    performanceScore: 95,
  },
];

export const currentUser = users[0];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Implement Authentication Flow",
    description: "Set up NextAuth with Google and Credentials provider. Ensure the session token is properly secured and exposed via the context.",
    assigneeId: "u1",
    projectId: "Project Alpha",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-04-16",
    assignedDate: "2026-04-10",
    assignedBy: "Admin",
    attachments: 2,
    comments: 4,
  },
  {
    id: "t2",
    title: "Design System Tokens",
    description: "Export all Figma design tokens to CSS variables and set up the base Tailwind Configuration.",
    assigneeId: "u3",
    projectId: "Core UI",
    priority: "Medium",
    status: "Pending Review",
    dueDate: "2026-04-15",
    assignedDate: "2026-04-12",
    assignedBy: "Admin",
    attachments: 1,
    comments: 1,
  },
  {
    id: "t3",
    title: "Database Migration Script",
    description: "Write the SQL migration script for the new User profile fields and verify rollbacks.",
    assigneeId: "u2",
    projectId: "Project Alpha",
    priority: "High",
    status: "Completed",
    dueDate: "2026-04-13",
    assignedDate: "2026-04-05",
    assignedBy: "Admin",
    attachments: 0,
    comments: 0,
  },
  {
    id: "t4",
    title: "Update API Documentation",
    description: "Review current endpoint logic and update the Swagger definitions to match the v2 schema changes.",
    assigneeId: "u2",
    projectId: "API Platform",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-04-20",
    assignedDate: "2026-04-14",
    assignedBy: "Admin",
    attachments: 0,
    comments: 0,
  },
  {
    id: "t5",
    title: "Dashboard Performance Metrics",
    description: "Integrate recharts and bind it to the generic usage telemetry api. Add caching layer so that dashboard load time is under 1s.",
    assigneeId: "u1",
    projectId: "Admin Tools",
    priority: "High",
    status: "Pending",
    dueDate: "2026-04-18",
    assignedDate: "2026-04-14",
    assignedBy: "Admin",
    attachments: 0,
    comments: 0,
  }
];

export const performanceData = [
  { name: 'Week 1', completed: 12, target: 10 },
  { name: 'Week 2', completed: 19, target: 15 },
  { name: 'Week 3', completed: 15, target: 15 },
  { name: 'Week 4', completed: 22, target: 20 },
];
