import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-guard';
import { updateProjectSchema } from '@/lib/validation';
import { asyncHandler, NotFoundError, ValidationError, AuthorizationError } from '@/lib/error-handler';
import { canEditProject, canDeleteProject, canViewProject } from '@/lib/permissions';
import { generateSlug } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { ActivityType } from '@prisma/client';

async function getProjectHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  const token = request.cookies.get('token')?.value;
  
  let user = null;
  if (token) {
    const authResult = await requireAuth(request);
    if (authResult.user) {
      user = authResult.user;
    }
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
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
  });

  if (!project) {
    throw new NotFoundError('المشروع غير موجود');
  }

  // Check view permission
  if (!canViewProject(user, project)) {
    throw new AuthorizationError('غير مصرح - لا يمكنك عرض هذا المشروع');
  }

  // Check if user liked this project
  let isLiked = false;
  if (user) {
    const like = await prisma.projectLike.findUnique({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: user.id,
        },
      },
    });
    isLiked = !!like;
  }

  // Increment views
  await prisma.project.update({
    where: { id: projectId },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json({
    project: {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      status: project.status,
      allowComments: project.allowComments,
      allowLikes: project.allowLikes,
      views: project.views + 1,
      likesCount: project._count.likes,
      commentsCount: project._count.comments,
      isLiked,
      author: project.author,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    },
  });
}

async function updateProjectHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request);
  if (!authResult.user) {
    return authResult.response!;
  }

  const projectId = params.id;
  const body = await request.json();

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundError('المشروع غير موجود');
  }

  // Check permission
  if (!canEditProject(authResult.user, project)) {
    throw new AuthorizationError('غير مصرح - لا يمكنك تعديل هذا المشروع');
  }

  // Validate input
  const validationResult = updateProjectSchema.safeParse(body);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Generate new slug if title changed
  let slug = project.slug;
  if (data.title && data.title !== project.title) {
    slug = generateSlug(data.title);
    
    // Check if new slug exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject && existingProject.id !== projectId) {
      throw new ValidationError('مشروع بنفس العنوان موجود بالفعل');
    }
  }

  // Update project
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(data.title && { title: data.title, slug }),
      ...(data.description && { description: data.description }),
      ...(data.content && { content: data.content }),
      ...(data.category && { category: data.category }),
      ...(data.status && { status: data.status }),
      ...(data.allowComments !== undefined && { allowComments: data.allowComments }),
      ...(data.allowLikes !== undefined && { allowLikes: data.allowLikes }),
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
      type: ActivityType.PROJECT_UPDATE,
      action: `تحديث مشروع: ${updatedProject.title}`,
      details: { projectId: updatedProject.id },
      ipAddress,
      userAgent,
    },
  });

  logger.info('Project updated', {
    projectId: updatedProject.id,
    userId: authResult.user.id,
  });

  return NextResponse.json({
    project: updatedProject,
    message: 'تم تحديث المشروع بنجاح',
  });
}

async function deleteProjectHandler(
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
  if (!canDeleteProject(authResult.user, project)) {
    throw new AuthorizationError('غير مصرح - لا يمكنك حذف هذا المشروع');
  }

  // Delete project (cascade will handle related records)
  await prisma.project.delete({
    where: { id: projectId },
  });

  // Log activity
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  await prisma.activityLog.create({
    data: {
      userId: authResult.user.id,
      type: ActivityType.PROJECT_DELETE,
      action: `حذف مشروع: ${project.title}`,
      details: { projectId },
      ipAddress,
      userAgent,
    },
  });

  logger.info('Project deleted', {
    projectId,
    userId: authResult.user.id,
  });

  return NextResponse.json({
    message: 'تم حذف المشروع بنجاح',
  });
}

export const GET = asyncHandler(getProjectHandler);
export const PATCH = asyncHandler(updateProjectHandler);
export const DELETE = asyncHandler(deleteProjectHandler);

