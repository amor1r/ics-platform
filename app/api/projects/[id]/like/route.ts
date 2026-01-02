import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { asyncHandler, NotFoundError, AuthorizationError } from '@/lib/error-handler';
import { canLike } from '@/lib/permissions';
import { ActivityType } from '@prisma/client';

async function toggleLikeHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const projectId = params.id;

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundError('المشروع غير موجود');
  }

  // Check permission
  if (!canLike(authResult.user, project)) {
    throw new AuthorizationError('غير مصرح - لا يمكنك الإعجاب بهذا المشروع');
  }

  // Check if already liked
  const existingLike = await prisma.projectLike.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: authResult.user.id,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.projectLike.delete({
      where: { id: existingLike.id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: authResult.user.id,
        type: ActivityType.LIKE_DELETE,
        action: `إلغاء إعجاب بمشروع: ${project.title}`,
        details: { projectId },
      },
    });

    const likesCount = await prisma.projectLike.count({
      where: { projectId },
    });

    return NextResponse.json({
      liked: false,
      likesCount,
    });
  } else {
    // Like
    await prisma.projectLike.create({
      data: {
        projectId,
        userId: authResult.user.id,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: authResult.user.id,
        type: ActivityType.LIKE_CREATE,
        action: `إعجاب بمشروع: ${project.title}`,
        details: { projectId },
      },
    });

    const likesCount = await prisma.projectLike.count({
      where: { projectId },
    });

    return NextResponse.json({
      liked: true,
      likesCount,
    });
  }
}

export const POST = asyncHandler(toggleLikeHandler);
export const DELETE = asyncHandler(toggleLikeHandler);

