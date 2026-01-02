import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { createUserSession } from '@/lib/session';
import { registerSchema } from '@/lib/validation';
import { asyncHandler, ValidationError, ConflictError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function registerHandler(request: NextRequest) {
  const formData = await request.formData();
  
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const birthdate = formData.get('birthdate') as string;
  const avatarFile = formData.get('avatar') as File | null;

  // Validate input
  const validationResult = registerSchema.safeParse({
    username,
    email,
    password,
    confirmPassword,
    birthdate,
  });

  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingEmail) {
    throw new ConflictError('البريد الإلكتروني مستخدم بالفعل');
  }

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new ConflictError('اسم المستخدم مستخدم بالفعل');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Handle avatar upload
  let avatarPath: string | null = null;
  if (avatarFile && avatarFile.size > 0) {
    try {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(avatarFile.type)) {
        throw new ValidationError('نوع الصورة غير مدعوم');
      }

      // Validate file size (5MB max)
      if (avatarFile.size > 5 * 1024 * 1024) {
        throw new ValidationError('حجم الصورة كبير جداً (الحد الأقصى 5MB)');
      }

      // Optimize and save image
      const optimizedImage = await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 85 })
        .toBuffer();

      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), optimizedImage);
      
      avatarPath = `/uploads/avatars/${filename}`;
    } catch (error) {
      logger.error('Avatar upload failed', { error });
      // Continue without avatar if upload fails
    }
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email: email.toLowerCase(),
      passwordHash,
      birthdate: new Date(birthdate),
      avatar: avatarPath,
      role: 'USER',
    },
  });

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

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      type: ActivityType.PROFILE_UPDATE,
      action: 'إنشاء حساب جديد',
      ipAddress,
      userAgent,
    },
  });

  // Create response
  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    message: 'تم إنشاء الحساب بنجاح',
  }, { status: 201 });

  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  response.cookies.set('token', token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  response.cookies.set('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}

export const POST = asyncHandler(registerHandler);
