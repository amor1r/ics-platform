import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, true);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'غير مصرح - يرجى تسجيل الدخول') {
    super(401, message, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'غير مصرح - لا تملك الصلاحيات المطلوبة') {
    super(403, message, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'المورد المطلوب غير موجود') {
    super(404, message, true);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'تعارض في البيانات') {
    super(409, message, true);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'تم تجاوز الحد المسموح من الطلبات') {
    super(429, message, true);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'حدث خطأ غير متوقع') {
    super(500, message, false);
  }
}

export function handleError(error: unknown, request: NextRequest): NextResponse {
  // Log the error
  logger.error('Error occurred', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    path: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  // Handle known errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Handle Prisma/Database errors
  if (error && typeof error === 'object') {
    const errorObj = error as any;
    
    // Prisma connection errors
    if (errorObj.code === 'P1001' || errorObj.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { 
          error: 'قاعدة البيانات غير متاحة. يرجى التحقق من إعدادات قاعدة البيانات.',
          code: 'DATABASE_CONNECTION_ERROR'
        },
        { status: 503 }
      );
    }
    
    // Prisma query errors
    if (errorObj.code?.startsWith('P')) {
      return NextResponse.json(
        { 
          error: 'خطأ في قاعدة البيانات',
          code: errorObj.code
        },
        { status: 500 }
      );
    }
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ path: string[]; message: string }> };
    const firstError = zodError.issues[0];
    return NextResponse.json(
      {
        error: 'خطأ في التحقق من البيانات',
        details: firstError ? {
          field: firstError.path.join('.'),
          message: firstError.message,
        } : undefined,
      },
      { status: 400 }
    );
  }

  // Handle unexpected errors
  return NextResponse.json(
    { 
      error: 'حدث خطأ غير متوقع',
      message: error instanceof Error ? error.message : String(error)
    },
    { status: 500 }
  );
}

export function asyncHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

