import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { JWT_CONFIG } from './constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      avatar: true,
      birthdate: true,
      isBanned: true,
    },
  });

  if (!user || user.isBanned) return null;

  return user;
}

export async function createSession(
  userId: string,
  token: string,
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days for refresh token

  return prisma.session.create({
    data: {
      userId,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });
}

export async function deleteSession(token: string) {
  return prisma.session.deleteMany({
    where: { token },
  });
}

export async function deleteAllUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}

export async function validateSession(token: string): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) return false;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return false;
  }

  return true;
}
