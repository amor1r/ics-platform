import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { asyncHandler } from '@/lib/error-handler';

async function meHandler(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      birthdate: user.birthdate?.toISOString() || null,
    },
  });
}

export const GET = asyncHandler(meHandler);
