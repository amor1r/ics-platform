import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { updateProfileSchema } from '@/lib/validation';
import { asyncHandler, ValidationError, ConflictError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';

async function getProfileHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const user = await prisma.user.findUnique({
    where: { id: authResult.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      birthdate: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'المستخدم غير موجود' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}

async function updateProfileHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const body = await request.json();

  // Validate input
  const validationResult = updateProfileSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Check if email/username already exists (if changed)
  if (data.email && data.email !== authResult.user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingEmail) {
      throw new ConflictError('البريد الإلكتروني مستخدم بالفعل');
    }
  }

  if (data.username && data.username !== authResult.user.username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new ConflictError('اسم المستخدم مستخدم بالفعل');
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: authResult.user.id },
    data: {
      ...(data.username && { username: data.username }),
      ...(data.email && { email: data.email.toLowerCase() }),
      ...(data.birthdate && { birthdate: new Date(data.birthdate) }),
    },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      birthdate: true,
      role: true,
    },
  });

  // Log activity
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: ActivityType.PROFILE_UPDATE,
      action: 'تحديث الملف الشخصي',
      ipAddress,
      userAgent,
    },
  });

  logger.info('Profile updated', {
    userId: authResult.user.id,
  });

  return NextResponse.json({
    user: updatedUser,
    message: 'تم تحديث الملف الشخصي بنجاح',
  });
}

export const GET = asyncHandler(getProfileHandler);
export const PATCH = asyncHandler(updateProfileHandler);
