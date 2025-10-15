import { Prisma } from '@prisma/client';

// Zodは必要に応じてインストール: npm install zod
// import { ZodError } from 'zod';

/**
 * カスタムAPIエラークラス
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * 認証エラー
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = '認証が必要です') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'AuthenticationError';
  }
}

/**
 * 権限エラー
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'アクセス権限がありません') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Foundエラー
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'リソースが見つかりません') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Conflictエラー
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'リソースが既に存在します') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

/**
 * レート制限エラー
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'リクエスト数が上限に達しました') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

/**
 * Prismaエラーを適切なAPIエラーに変換
 */
export function handlePrismaError(error: unknown): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'フィールド';
        return new ConflictError(`${field}が既に存在します`);

      case 'P2025':
        // Record not found
        return new NotFoundError('レコードが見つかりません');

      case 'P2003':
        // Foreign key constraint failed
        return new ValidationError('関連するレコードが存在しません');

      case 'P2014':
        // Required relation violation
        return new ValidationError('必須の関連が設定されていません');

      default:
        return new ApiError(
          'データベースエラーが発生しました',
          500,
          'DATABASE_ERROR',
          { code: error.code }
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('入力データが不正です');
  }

  // その他のPrismaエラー
  return new ApiError('データベースエラーが発生しました', 500, 'DATABASE_ERROR');
}

/**
 * Zodエラーをバリデーションエラーに変換
 * Zodを使用する場合は: npm install zod
 */
export function handleZodError(error: any): ValidationError {
  const errors: Record<string, string[]> = {};

  error.errors.forEach((err: any) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return new ValidationError('バリデーションエラー', { errors });
}

/**
 * エラーをログに記録
 */
export function logError(error: unknown, context?: string): void {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    console.error('🔴 Error:', context || 'Unknown context');
    console.error(error);
  } else {
    // 本番環境では構造化ログ
    const errorInfo: any = {
      timestamp: new Date().toISOString(),
      context: context || 'Unknown',
    };

    if (error instanceof Error) {
      errorInfo.name = error.name;
      errorInfo.message = error.message;
      errorInfo.stack = error.stack;
    } else {
      errorInfo.error = error;
    }

    console.error(JSON.stringify(errorInfo));
  }
}

/**
 * エラーをAPIエラーに変換
 */
export function toApiError(error: unknown): ApiError {
  // 既にApiErrorの場合
  if (error instanceof ApiError) {
    return error;
  }

  // Prismaエラー
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    return handlePrismaError(error);
  }

  // Zodエラー（Zodを使用している場合）
  if (error && typeof error === 'object' && 'issues' in error) {
    return handleZodError(error);
  }

  // 通常のErrorオブジェクト
  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  // その他
  return new ApiError('予期しないエラーが発生しました');
}
