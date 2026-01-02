import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { asyncHandler } from '@/lib/error-handler';

async function getStatsHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const [projectsCount, likesCount, commentsCount] = await Promise.all([
    prisma.project.count({
      where: {
        status: 'PUBLISHED',
      },
    }),
    prisma.projectLike.count({
      where: {
        userId: authResult.user.id,
      },
    }),
    prisma.comment.count({
      where: {
        userId: authResult.user.id,
      },
    }),
  ]);

  return NextResponse.json({
    stats: {
      projectsCount,
      likesCount,
      commentsCount,
    },
  });
}

export const GET = asyncHandler(getStatsHandler);

