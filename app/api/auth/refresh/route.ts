import { NextRequest, NextResponse } from 'next/server';
import { refreshUserSession } from '@/lib/session';
import { asyncHandler, AuthenticationError } from '@/lib/error-handler';

async function refreshHandler(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    throw new AuthenticationError('رمز التحديث غير موجود');
  }

  const result = await refreshUserSession(refreshToken);

  if (!result) {
    throw new AuthenticationError('رمز التحديث غير صالح أو منتهي الصلاحية');
  }

  const response = NextResponse.json({
    message: 'تم تحديث الجلسة بنجاح',
  });

  // Update cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  response.cookies.set('token', result.token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  response.cookies.set('refreshToken', result.refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}

export const POST = asyncHandler(refreshHandler);

