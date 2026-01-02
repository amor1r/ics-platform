export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Member
  MEMBER_DASHBOARD: '/member/dashboard',
  MEMBER_PROFILE: '/member/profile',
  MEMBER_PROJECTS: '/member/projects',
  MEMBER_PROJECT: (id: string) => `/member/project/${id}`,
  
  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_INVITES: '/admin/invites',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  PROJECTS: {
    LIST: '/api/projects',
    DETAIL: (id: string) => `/api/projects/${id}`,
    LIKE: (id: string) => `/api/projects/${id}/like`,
  },
  COMMENTS: {
    LIST: '/api/comments',
    DETAIL: (id: string) => `/api/comments/${id}`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAIL: (id: string) => `/api/admin/users/${id}`,
    LOGS: '/api/admin/logs',
    INVITES: '/api/admin/invites',
    INVITE_DETAIL: (token: string) => `/api/admin/invites/${token}`,
  },
  FILES: {
    UPLOAD: '/api/files/upload',
  },
  SEARCH: {
    MAIN: '/api/search',
  },
  USER: {
    PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
  },
} as const;

export const RATE_LIMITS = {
  LOGIN: { max: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  REGISTER: { max: 3, window: 60 * 60 * 1000 }, // 3 attempts per hour
  COMMENTS: { max: 5, window: 60 * 1000 }, // 5 comments per minute
  PROJECTS: { max: 10, window: 60 * 1000 }, // 10 requests per minute
  DEFAULT: { max: 100, window: 60 * 1000 }, // 100 requests per minute
} as const;

export const FILE_LIMITS = {
  AVATAR: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  PROJECT: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['*'], // All types for educational files
  },
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 12,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
} as const;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
