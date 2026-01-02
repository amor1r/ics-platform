import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createUserSession } from '@/lib/session';
import { loginSchema } from '@/lib/validation';
import { asyncHandler, AuthenticationError, ValidationError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';

async function loginHandler(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  const validationResult = loginSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const { email, password, rememberMe, userType } = validationResult.data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AuthenticationError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  // Check if user is banned
  if (user.isBanned) {
    throw new AuthenticationError('تم حظر حسابك');
  }

  // Verify user type matches
  if (userType === 'admin' && user.role !== 'ADMIN') {
    throw new AuthenticationError('ليس لديك صلاحية للدخول كمدير');
  }

  if (userType === 'member' && user.role === 'ADMIN') {
    // Admins can login as members, but we log this
    logger.warn('Admin logging in as member', { userId: user.id });
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AuthenticationError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  // Get IP and User Agent
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  // Create session (this generates tokens internally)
  const { token, refreshToken } = await createUserSession(
    user.id,
    user.email,
    user.role,
    ipAddress,
    userAgent
  );

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      type: ActivityType.LOGIN,
      action: 'تسجيل دخول',
      ipAddress,
      userAgent,
    },
  });

  // Create response
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
    },
    message: 'تم تسجيل الدخول بنجاح',
  });

  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  response.cookies.set('token', token, {
    ...cookieOptions,
    maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7 days or 1 day
  });

  response.cookies.set('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}

export const POST = asyncHandler(loginHandler);
