import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { asyncHandler, AuthorizationError } from '@/lib/error-handler';

async function getStatsHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  // Check if user is admin
  if (authResult.user.role !== 'ADMIN') {
    throw new AuthorizationError('غير مصرح - للمدراء فقط');
  }

  const [
    usersCount,
    projectsCount,
    publishedProjects,
    draftProjects,
    commentsCount,
    logsCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count({ where: { status: 'DRAFT' } }),
    prisma.comment.count(),
    prisma.activityLog.count(),
  ]);

  return NextResponse.json({
    stats: {
      usersCount,
      projectsCount,
      publishedProjects,
      draftProjects,
      commentsCount,
      logsCount,
    },
  });
}

export const GET = asyncHandler(getStatsHandler);

