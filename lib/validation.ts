import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  rememberMe: z.boolean().optional().default(false),
  userType: z.enum(['admin', 'member'], {
    required_error: 'نوع المستخدم مطلوب',
  }),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
    .max(30, 'اسم المستخدم يجب أن يكون 30 حرف على الأكثر')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يمكن أن يحتوي على أحرف إنجليزية وأرقام و_ فقط'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(12, 'كلمة المرور يجب أن تكون 12 حرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير على الأقل')
    .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم على الأقل')
    .regex(/[^A-Za-z0-9]/, 'كلمة المرور يجب أن تحتوي على رمز خاص على الأقل'),
  confirmPassword: z.string(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تاريخ الميلاد غير صحيح'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'رمز إعادة التعيين مطلوب'),
  password: z
    .string()
    .min(12, 'كلمة المرور يجب أن تكون 12 حرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير على الأقل')
    .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم على الأقل')
    .regex(/[^A-Za-z0-9]/, 'كلمة المرور يجب أن تحتوي على رمز خاص على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z
    .string()
    .min(12, 'كلمة المرور يجب أن تكون 12 حرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير على الأقل')
    .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم على الأقل')
    .regex(/[^A-Za-z0-9]/, 'كلمة المرور يجب أن تحتوي على رمز خاص على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

// Project Schemas
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان يجب أن يكون 200 حرف على الأكثر'),
  description: z
    .string()
    .min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل')
    .max(500, 'الوصف يجب أن يكون 500 حرف على الأكثر'),
  content: z.string().min(50, 'المحتوى يجب أن يكون 50 حرف على الأقل'),
  category: z.enum(['TOOLS', 'KALI_LINUX', 'COMMANDS', 'GENERAL_CYBER'], {
    required_error: 'الفئة مطلوبة',
  }),
  allowComments: z.boolean().default(true),
  allowLikes: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export const updateProjectSchema = createProjectSchema.partial();

// Comment Schemas
export const createCommentSchema = z.object({
  projectId: z.string().cuid('معرف المشروع غير صحيح').optional(),
  contentId: z.string().cuid('معرف المحتوى غير صحيح').optional(),
  comment: z
    .string()
    .min(1, 'التعليق مطلوب')
    .max(2000, 'التعليق يجب أن يكون 2000 حرف على الأكثر'),
  parentId: z.string().cuid('معرف التعليق الأب غير صحيح').optional(),
}).refine((data) => data.projectId || data.contentId, {
  message: 'يجب تحديد معرف المشروع أو المحتوى',
  path: ['projectId'],
});

export const updateCommentSchema = z.object({
  comment: z
    .string()
    .min(1, 'التعليق مطلوب')
    .max(2000, 'التعليق يجب أن يكون 2000 حرف على الأكثر'),
});

// User Schemas
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
    .max(30, 'اسم المستخدم يجب أن يكون 30 حرف على الأكثر')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يمكن أن يحتوي على أحرف إنجليزية وأرقام و_ فقط')
    .optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تاريخ الميلاد غير صحيح').optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'MODERATOR', 'ADMIN'], {
    required_error: 'الدور مطلوب',
  }),
});

export const banUserSchema = z.object({
  reason: z.string().min(10, 'يجب كتابة سبب الحظر').max(500, 'سبب الحظر طويل جداً'),
});

// Admin Invite Schema
export const createAdminInviteSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(1, 'كلمة البحث مطلوبة').max(100, 'كلمة البحث طويلة جداً'),
  category: z.enum(['TOOLS', 'KALI_LINUX', 'COMMANDS', 'GENERAL_CYBER']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'اسم الملف مطلوب'),
  size: z.number().int().min(1).max(52428800, 'حجم الملف كبير جداً'), // 50MB max
  mimeType: z.string().min(1, 'نوع الملف مطلوب'),
});

// Helper function to validate and sanitize input
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

// Helper function to validate email
export function isValidEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

// Helper function to validate CUID
export function isValidCuid(id: string): boolean {
  return z.string().cuid().safeParse(id).success;
}
