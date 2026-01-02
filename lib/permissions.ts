import { UserRole } from '@prisma/client';
import { prisma } from './prisma';

export interface User {
  id: string;
  role: UserRole;
  isBanned: boolean;
}

export interface Project {
  id: string;
  authorId: string;
  allowComments: boolean;
  allowLikes: boolean;
  status: string;
}

// Project Permissions
export function canCreateProject(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned;
}

export function canEditProject(user: User, project: Project): boolean {
  if (user.isBanned) return false;
  return user.role === 'ADMIN' || (user.role === 'MODERATOR' && project.authorId === user.id);
}

export function canDeleteProject(user: User, project: Project): boolean {
  if (user.isBanned) return false;
  return user.role === 'ADMIN' || (user.role === 'MODERATOR' && project.authorId === user.id);
}

export function canViewProject(user: User | null, project: Project): boolean {
  if (project.status === 'PUBLISHED') return true;
  if (!user) return false;
  if (user.isBanned) return false;
  return user.role === 'ADMIN' || project.authorId === user.id;
}

export function canComment(user: User | null, project: Project): boolean {
  if (!user || user.isBanned) return false;
  if (!project.allowComments) return false;
  return project.status === 'PUBLISHED';
}

export function canLike(user: User | null, project: Project): boolean {
  if (!user || user.isBanned) return false;
  if (!project.allowLikes) return false;
  return project.status === 'PUBLISHED';
}

// User Management Permissions
export function canManageUsers(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned;
}

export function canBanUser(admin: User, targetUser: User): boolean {
  if (admin.isBanned || admin.role !== 'ADMIN') return false;
  if (targetUser.role === 'ADMIN') return false; // Cannot ban other admins
  return true;
}

export function canUnbanUser(admin: User, _targetUser: User): boolean {
  if (admin.isBanned || admin.role !== 'ADMIN') return false;
  return true;
}

export function canChangeUserRole(admin: User, targetUser: User, newRole: UserRole): boolean {
  if (admin.isBanned || admin.role !== 'ADMIN') return false;
  if (targetUser.role === 'ADMIN' && newRole !== 'ADMIN') return false; // Cannot demote admins
  return true;
}

// Admin Permissions
export function canViewLogs(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned;
}

export function canCreateAdmin(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned;
}

export function canManageSettings(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned;
}

// Comment Permissions
export async function canEditComment(user: User, commentId: string): Promise<boolean> {
  if (user.isBanned) return false;
  
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!comment) return false;
  return user.role === 'ADMIN' || comment.userId === user.id;
}

export async function canDeleteComment(user: User, commentId: string): Promise<boolean> {
  if (user.isBanned) return false;
  
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!comment) return false;
  return user.role === 'ADMIN' || comment.userId === user.id;
}

// Profile Permissions
export function canEditProfile(user: User, targetUserId: string): boolean {
  if (user.isBanned) return false;
  return user.id === targetUserId || user.role === 'ADMIN';
}

export function canViewProfile(_user: User | null, _targetUserId: string): boolean {
  // Users can always view profiles (for now)
  return true;
}

