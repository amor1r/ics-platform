import { UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { verifyRefreshToken, generateToken, generateRefreshToken } from './auth';
import type { TokenPayload } from './auth';

export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  ipAddress?: string;
  userAgent?: string;
}

export async function createUserSession(
  userId: string,
  email: string,
  role: UserRole,
  ipAddress?: string,
  userAgent?: string
) {
  const payload: TokenPayload = { userId, email, role };
  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.session.create({
    data: {
      userId,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return { token, refreshToken };
}

export async function refreshUserSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;

  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || session.user.isBanned) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  const newPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };

  const newToken = generateToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      token: newToken,
      refreshToken: newRefreshToken,
    },
  });

  return { token: newToken, refreshToken: newRefreshToken };
}

export async function invalidateSession(token: string) {
  return prisma.session.deleteMany({
    where: { token },
  });
}

export async function invalidateAllUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}

export async function cleanupExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}

