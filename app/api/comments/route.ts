import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { createCommentSchema, paginationSchema } from '@/lib/validation';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '@/lib/error-handler';
import { canComment } from '@/lib/permissions';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';
import { PAGINATION } from '@/lib/constants';

async function getCommentsHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const projectId = searchParams.get('projectId');
  const contentId = searchParams.get('contentId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));

  if (!projectId && !contentId) {
    throw new ValidationError('يجب تحديد معرف المشروع أو المحتوى');
  }

  // Validate pagination
  const paginationResult = paginationSchema.safeParse({ page, limit });
  if (!paginationResult.success) {
    throw new ValidationError('معاملات الصفحة غير صحيحة');
  }

  const skip = (page - 1) * limit;

  const where: any = {};
  if (projectId) {
    where.projectId = projectId;
  }
  if (contentId) {
    where.contentId = contentId;
  }
  where.parentId = null; // Only top-level comments

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await prisma.comment.findMany({
        where: { parentId: comment.id },
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        take: 10, // Limit replies per comment
      });

      return {
        id: comment.id,
        comment: comment.comment,
        user: comment.user,
        repliesCount: comment._count.replies,
        replies,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    })
  );

  return NextResponse.json({
    comments: commentsWithReplies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

async function createCommentHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const body = await request.json();

  // Validate input
  const validationResult = createCommentSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Check if project/content exists and get it
  let project = null;
  if (data.projectId) {
    project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundError('المشروع غير موجود');
    }

    // Check permission
    if (!canComment(authResult.user, project)) {
      throw new AuthorizationError('غير مصرح - لا يمكنك التعليق على هذا المشروع');
    }
  }

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      projectId: data.projectId || null,
      contentId: data.contentId || null,
      userId: authResult.user.id,
      comment: data.comment,
      parentId: data.parentId || null,
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
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: ActivityType.COMMENT_CREATE,
      action: 'إضافة تعليق',
      details: {
        commentId: comment.id,
        projectId: data.projectId,
        contentId: data.contentId,
      },
      ipAddress,
      userAgent,
    },
  });

  logger.info('Comment created', {
    commentId: comment.id,
    userId: authResult.user.id,
  });

  return NextResponse.json(
    {
      comment,
      message: 'تم إضافة التعليق بنجاح',
    },
    { status: 201 }
  );
}

export const GET = asyncHandler(getCommentsHandler);
export const POST = asyncHandler(createCommentHandler);
