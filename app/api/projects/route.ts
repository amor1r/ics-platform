import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { createProjectSchema, paginationSchema } from '@/lib/validation';
import { asyncHandler, ValidationError, AuthorizationError } from '@/lib/error-handler';
import { canCreateProject } from '@/lib/permissions';
import { generateSlug } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { ActivityType, ProjectStatus } from '@prisma/client';
import { PAGINATION } from '@/lib/constants';

async function getProjectsHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const status = searchParams.get('status') || 'PUBLISHED';

  // Validate pagination
  const paginationResult = paginationSchema.safeParse({ page, limit });
  if (!paginationResult.success) {
    throw new ValidationError('معاملات الصفحة غير صحيحة');
  }

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  
  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build orderBy
  let orderBy: any = {};
  if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'popular') {
    orderBy = { views: 'desc' };
  }

  // Get projects
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({
    projects: projects.map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category,
      status: project.status,
      allowComments: project.allowComments,
      allowLikes: project.allowLikes,
      views: project.views,
      likesCount: project._count.likes,
      commentsCount: project._count.comments,
      author: project.author,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

async function createProjectHandler(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  // Check permission
  if (!canCreateProject(authResult.user)) {
    throw new AuthorizationError('غير مصرح - فقط المدراء يمكنهم إنشاء المشاريع');
  }

  const body = await request.json();

  // Validate input
  const validationResult = createProjectSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Generate slug
  const slug = generateSlug(data.title);

  // Check if slug exists
  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (existingProject) {
    throw new ValidationError('مشروع بنفس العنوان موجود بالفعل');
  }

  // Create project
  const project = await prisma.project.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      category: data.category,
      authorId: authResult.user.id,
      status: data.status || ProjectStatus.DRAFT,
      allowComments: data.allowComments ?? true,
      allowLikes: data.allowLikes ?? true,
    },
    include: {
      author: {
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
      type: ActivityType.PROJECT_CREATE,
      action: `إنشاء مشروع: ${project.title}`,
      details: { projectId: project.id },
      ipAddress,
      userAgent,
    },
  });

  logger.info('Project created', {
    projectId: project.id,
    authorId: authResult.user.id,
  });

  return NextResponse.json(
    {
      project: {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        status: project.status,
        author: project.author,
        createdAt: project.createdAt,
      },
      message: 'تم إنشاء المشروع بنجاح',
    },
    { status: 201 }
  );
}

export const GET = asyncHandler(getProjectsHandler);
export const POST = asyncHandler(createProjectHandler);

