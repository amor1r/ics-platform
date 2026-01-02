import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { invalidateSession } from '@/lib/session';
import { asyncHandler } from '@/lib/error-handler';
import { ActivityType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

async function logoutHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (!authResult.user) {
    return authResult.response!;
  }

  const token = request.cookies.get('token')?.value;
  
  if (token) {
    await invalidateSession(token);
  }

  // Log activity
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: ActivityType.LOGOUT,
      action: 'تسجيل خروج',
      ipAddress,
      userAgent,
    },
  });

  // Create response
  const response = NextResponse.json({
    message: 'تم تسجيل الخروج بنجاح',
  });

  // Clear cookies
  response.cookies.delete('token');
  response.cookies.delete('refreshToken');

  return response;
}

export const POST = asyncHandler(logoutHandler);
