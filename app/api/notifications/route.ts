import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { asyncHandler } from '@/lib/error-handler';

async function getNotificationsHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  // For now, return empty array (notifications system not fully implemented)
  // This prevents errors in the UI
  return NextResponse.json({
    notifications: [],
    unreadCount: 0,
  });
}

export const GET = asyncHandler(getNotificationsHandler);
