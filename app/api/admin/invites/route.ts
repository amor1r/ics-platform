import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { createAdminInviteSchema } from '@/lib/validation';
import { asyncHandler, ValidationError, AuthorizationError, ConflictError } from '@/lib/error-handler';
import { canCreateAdmin } from '@/lib/permissions';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';
import crypto from 'crypto';

async function getInvitesHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  // Check permission
  if (!canCreateAdmin(authResult.user)) {
    throw new AuthorizationError('غير مصرح - للمدراء فقط');
  }

  const invites = await prisma.adminInvite.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    take: 100,
  });

  return NextResponse.json({ invites });
}

async function createInviteHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  // Check permission
  if (!canCreateAdmin(authResult.user)) {
    throw new AuthorizationError('غير مصرح - للمدراء فقط');
  }

  const body = await request.json();

  // Validate input
  const validationResult = createAdminInviteSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const { email, expiresInDays = 7 } = validationResult.data;

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('مستخدم بهذا البريد الإلكتروني موجود بالفعل');
  }

  // Check if there's an active invite for this email
  const existingInvite = await prisma.adminInvite.findFirst({
    where: {
      email: email.toLowerCase(),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (existingInvite) {
    throw new ConflictError('دعوة نشطة موجودة بالفعل لهذا البريد الإلكتروني');
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');

  // Create invite
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const invite = await prisma.adminInvite.create({
    data: {
      token,
      email: email.toLowerCase(),
      createdById: authResult.user.id,
      expiresAt,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
        },
      },
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
      type: ActivityType.ADMIN_INVITE,
      action: `إنشاء دعوة مدير: ${email}`,
      details: { inviteId: invite.id, email },
      ipAddress,
      userAgent,
    },
  });

  logger.info('Admin invite created', {
    inviteId: invite.id,
    email,
    createdBy: authResult.user.id,
  });

  return NextResponse.json(
    {
      invite: {
        ...invite,
        token, // Include token in response for admin to share
      },
      message: 'تم إنشاء الدعوة بنجاح',
    },
    { status: 201 }
  );
}

export const GET = asyncHandler(getInvitesHandler);
export const POST = asyncHandler(createInviteHandler);

