import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchSchema } from '@/lib/validation';
import { asyncHandler, ValidationError } from '@/lib/error-handler';
import { PAGINATION } from '@/lib/constants';

async function searchHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
  const sort = searchParams.get('sort') || 'newest';

  // Validate input
  const validationResult = searchSchema.safeParse({
    query,
    category: category || undefined,
    page,
    limit,
    sort,
  });

  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    status: 'PUBLISHED',
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
    ],
  };

  if (category) {
    where.category = category;
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

  // Search projects
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
      author: project.author,
      views: project.views,
      likesCount: project._count.likes,
      commentsCount: project._count.comments,
      createdAt: project.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export const GET = asyncHandler(searchHandler);
