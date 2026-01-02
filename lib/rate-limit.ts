import { NextRequest, NextResponse } from 'next/server';
import { RATE_LIMITS } from './constants';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production)
const rateLimitStore: RateLimitStore = {};

interface RateLimitConfig {
  max: number;
  window: number; // in milliseconds
}

function getRateLimitKey(identifier: string, endpoint: string): string {
  return `${identifier}:${endpoint}`;
}

function getRateLimitConfig(endpoint: string): RateLimitConfig {
  if (endpoint.includes('/api/auth/login')) return RATE_LIMITS.LOGIN;
  if (endpoint.includes('/api/auth/register')) return RATE_LIMITS.REGISTER;
  if (endpoint.includes('/api/comments')) return RATE_LIMITS.COMMENTS;
  if (endpoint.includes('/api/projects')) return RATE_LIMITS.PROJECTS;
  return RATE_LIMITS.DEFAULT;
}

export function checkRateLimit(
  identifier: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = getRateLimitConfig(endpoint);
  const key = getRateLimitKey(identifier, endpoint);
  const now = Date.now();

  const record = rateLimitStore[key];

  if (!record || record.resetTime < now) {
    // Create new record or reset expired one
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.window,
    };
    return {
      allowed: true,
      remaining: config.max - 1,
      resetTime: now + config.window,
    };
  }

  if (record.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.max - record.count,
    resetTime: record.resetTime,
  };
}

export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from token first
  const token = request.cookies.get('token')?.value;
  if (token) {
    try {
      // In a real implementation, you'd verify the token and extract user ID
      // For now, we'll use IP address as fallback
    } catch {
      // Token invalid, use IP
    }
  }

  // Fallback to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export function rateLimitMiddleware(
  request: NextRequest
): NextResponse | null {
  const identifier = getClientIdentifier(request);
  const endpoint = request.nextUrl.pathname;
  const result = checkRateLimit(identifier, endpoint);

  if (!result.allowed) {
    const resetTimeSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: 'تم تجاوز الحد المسموح من الطلبات',
        message: `يرجى المحاولة مرة أخرى بعد ${resetTimeSeconds} ثانية`,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': getRateLimitConfig(endpoint).max.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          'Retry-After': resetTimeSeconds.toString(),
        },
      }
    );
  }

  return null;
}

// Cleanup expired entries periodically (in production, use Redis TTL)
export function cleanupRateLimitStore() {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
