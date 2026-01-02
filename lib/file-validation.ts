import { FILE_LIMITS } from './constants';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateAvatarFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > FILE_LIMITS.AVATAR.MAX_SIZE) {
    return {
      isValid: false,
      error: `حجم الصورة كبير جداً. الحد الأقصى ${formatFileSize(FILE_LIMITS.AVATAR.MAX_SIZE)}`,
    };
  }

  // Check file type
  if (!(FILE_LIMITS.AVATAR.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WEBP',
    };
  }

  return { isValid: true };
}

export function validateProjectFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > FILE_LIMITS.PROJECT.MAX_SIZE) {
    return {
      isValid: false,
      error: `حجم الملف كبير جداً. الحد الأقصى ${formatFileSize(FILE_LIMITS.PROJECT.MAX_SIZE)}`,
    };
  }

  // For project files, we allow all types (educational files)
  return { isValid: true };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 255);
}

