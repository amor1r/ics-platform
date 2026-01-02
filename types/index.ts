import { UserRole, ProjectCategory, ProjectStatus, ActivityType } from '@prisma/client';

export type { UserRole, ProjectCategory, ProjectStatus, ActivityType };

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar: string | null;
  birthdate?: Date | null;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: ProjectCategory;
  authorId: string;
  status: ProjectStatus;
  allowComments: boolean;
  allowLikes: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
    avatar: string | null;
  };
  likesCount?: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  projectId?: string;
  contentId?: string;
  userId: string;
  comment: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    avatar: string | null;
  };
  replies?: Comment[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: ActivityType;
  action: string;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
  };
}
