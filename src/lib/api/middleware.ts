import { NextRequest } from 'next/server';
import { User } from '@/lib/service/user';
import type { UserRole } from '@prisma/client';
import {
  AuthenticationError,
  AuthorizationError,
  toApiError,
  logError,
} from './error';
import { errorResponse, serverErrorResponse } from './response';

/**
 * リクエストコンテキスト
 */
export type RequestContext = {
  user: User;
  params?: Record<string, string>;
};

/**
 * Next.js Route Context
 */
export type RouteContext = {
  params: Promise<Record<string, string>>;
};

/**
 * API ハンドラーの型定義
 */
export type ApiHandler<T = any> = (
  request: NextRequest,
  context?: RequestContext
) => Promise<Response> | Response;

/**
 * 認証が必要なAPIハンドラーをラップ
 * @param handler - APIハンドラー関数
 * @returns ラップされたハンドラー
 */
export function withAuth(handler: ApiHandler) {
  return async (request: NextRequest, routeContext?: RouteContext): Promise<Response> => {
    try {
      // 現在のユーザーを取得
      const user = await User.current();

      if (!user) {
        throw new AuthenticationError('認証が必要です');
      }

      // パラメータを取得
      const params = routeContext?.params ? await routeContext.params : undefined;

      // コンテキストを作成
      const context: RequestContext = {
        user,
        params,
      };

      // ハンドラーを実行
      return await handler(request, context);
    } catch (error) {
      logError(error, 'withAuth');

      if (error instanceof AuthenticationError) {
        return errorResponse(error.message, {
          status: error.statusCode,
          code: error.code,
        });
      }

      const apiError = toApiError(error);
      return errorResponse(apiError.message, {
        status: apiError.statusCode,
        code: apiError.code,
        details: apiError.details,
      });
    }
  };
}

/**
 * 特定のロールが必要なAPIハンドラーをラップ
 * @param handler - APIハンドラー関数
 * @param allowedRoles - 許可されるロール
 * @returns ラップされたハンドラー
 */
export function withRole(
  handler: ApiHandler,
  allowedRoles: UserRole[]
) {
  return async (request: NextRequest, routeContext?: RouteContext): Promise<Response> => {
    try {
      // 現在のユーザーを取得
      const user = await User.current();

      if (!user) {
        throw new AuthenticationError('認証が必要です');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AuthorizationError(
          'この操作を実行する権限がありません'
        );
      }

      // パラメータを取得
      const params = routeContext?.params ? await routeContext.params : undefined;

      // コンテキストを作成
      const context: RequestContext = {
        user,
        params,
      };

      return await handler(request, context);
    } catch (error) {
      logError(error, 'withRole');

      if (error instanceof AuthorizationError) {
        return errorResponse(error.message, {
          status: error.statusCode,
          code: error.code,
        });
      }

      if (error instanceof AuthenticationError) {
        return errorResponse(error.message, {
          status: error.statusCode,
          code: error.code,
        });
      }

      const apiError = toApiError(error);
      return errorResponse(apiError.message, {
        status: apiError.statusCode,
        code: apiError.code,
        details: apiError.details,
      });
    }
  };
}

/**
 * エラーハンドリングをラップ
 * @param handler - APIハンドラー関数
 * @returns ラップされたハンドラー
 */
export function withErrorHandler(handler: ApiHandler) {
  return async (request: NextRequest, routeContext?: RouteContext): Promise<Response> => {
    try {
      // パラメータを取得
      const params = routeContext?.params ? await routeContext.params : undefined;
      
      // コンテキストを作成（ユーザーなし）
      const context: RequestContext | undefined = params ? { user: null as any, params } : undefined;
      
      return await handler(request, context);
    } catch (error) {
      logError(error, 'API Handler');

      const apiError = toApiError(error);

      // 開発環境ではスタックトレースも含める
      const isDevelopment = process.env.NODE_ENV === 'development';

      return errorResponse(apiError.message, {
        status: apiError.statusCode,
        code: apiError.code,
        details: isDevelopment ? apiError.details : undefined,
      });
    }
  };
}

/**
 * HTTPメソッドを検証
 * @param request - リクエスト
 * @param allowedMethods - 許可されるメソッド
 */
export function validateMethod(
  request: NextRequest,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    const error = new Error('Method not allowed');
    (error as any).statusCode = 405;
    (error as any).allowedMethods = allowedMethods;
    throw error;
  }
}

/**
 * リクエストボディをJSONとして取得
 * @param request - リクエスト
 * @returns パースされたボディ
 */
export async function getRequestBody<T = any>(
  request: NextRequest
): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('リクエストボディのパースに失敗しました');
  }
}

/**
 * クエリパラメータを取得
 * @param request - リクエスト
 * @param key - パラメータ名
 * @param defaultValue - デフォルト値
 * @returns パラメータ値
 */
export function getQueryParam(
  request: NextRequest,
  key: string,
  defaultValue?: string
): string | undefined {
  return request.nextUrl.searchParams.get(key) || defaultValue;
}

/**
 * 数値のクエリパラメータを取得
 * @param request - リクエスト
 * @param key - パラメータ名
 * @param defaultValue - デフォルト値
 * @returns パラメータ値
 */
export function getNumberParam(
  request: NextRequest,
  key: string,
  defaultValue?: number
): number | undefined {
  const value = getQueryParam(request, key);
  if (!value) return defaultValue;

  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * ページネーションパラメータを取得
 * @param request - リクエスト
 * @returns ページネーション情報
 */
export function getPaginationParams(request: NextRequest): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, getNumberParam(request, 'page', 1) || 1);
  const limit = Math.min(100, Math.max(1, getNumberParam(request, 'limit', 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * IPアドレスを取得
 * @param request - リクエスト
 * @returns IPアドレス
 */
export function getClientIp(request: NextRequest): string | null {
  // Vercelの場合
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // その他のヘッダー
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    null
  );
}

/**
 * User-Agentを取得
 * @param request - リクエスト
 * @returns User-Agent
 */
export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent');
}
