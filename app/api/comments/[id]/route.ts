import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { updateCommentSchema } from '@/lib/validation';
import { asyncHandler, NotFoundError, ValidationError, AuthorizationError } from '@/lib/error-handler';
import { canEditComment, canDeleteComment } from '@/lib/permissions';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';

async function updateCommentHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const commentId = params.id;
  const body = await request.json();

  // Get comment
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new NotFoundError('التعليق غير موجود');
  }

  // Check permission
  if (!(await canEditComment(authResult.user, commentId))) {
    throw new AuthorizationError('غير مصرح - لا يمكنك تعديل هذا التعليق');
  }

  // Validate input
  const validationResult = updateCommentSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  // Update comment
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      comment: validationResult.data.comment,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: ActivityType.COMMENT_CREATE, // Using same type for update
      action: 'تعديل تعليق',
      details: { commentId },
    },
  });

  return NextResponse.json({
    comment: updatedComment,
    message: 'تم تحديث التعليق بنجاح',
  });
}

async function deleteCommentHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const commentId = params.id;

  // Get comment
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new NotFoundError('التعليق غير موجود');
  }

  // Check permission
  if (!(await canDeleteComment(authResult.user, commentId))) {
    throw new AuthorizationError('غير مصرح - لا يمكنك حذف هذا التعليق');
  }

  // Delete comment (cascade will handle replies)
  await prisma.comment.delete({
    where: { id: commentId },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: ActivityType.COMMENT_DELETE,
      action: 'حذف تعليق',
      details: { commentId },
    },
  });

  logger.info('Comment deleted', {
    commentId,
    userId: authResult.user.id,
  });

  return NextResponse.json({
    message: 'تم حذف التعليق بنجاح',
  });
}

export const PATCH = asyncHandler(updateCommentHandler);
export const DELETE = asyncHandler(deleteCommentHandler);

