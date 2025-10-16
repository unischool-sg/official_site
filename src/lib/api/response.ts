import { NextResponse } from "next/server";

/**
 * APIレスポンスの型定義
 */
export type ApiResponse<T = any> = {
     success: boolean;
     data?: T;
     error?: {
          message: string;
          code?: string;
          details?: any;
     };
     meta?: {
          timestamp: string;
          requestId?: string;
          [key: string]: any;
     };
};

/**
 * ページネーション付きレスポンスの型定義
 */
export type PaginatedApiResponse<T = any> = ApiResponse<T> & {
     pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
     };
};

/**
 * 成功レスポンスを生成
 * @param data - レスポンスデータ
 * @param options - オプション
 * @returns NextResponse
 */
export function successResponse<T>(
     data: T,
     options?: {
          status?: number;
          meta?: Record<string, any>;
          headers?: Record<string, string>;
     },
): NextResponse<ApiResponse<T>> {
     const { status = 200, meta = {}, headers = {} } = options || {};

     const response: ApiResponse<T> = {
          success: true,
          data,
          meta: {
               timestamp: new Date().toISOString(),
               ...meta,
          },
     };

     return NextResponse.json(response, {
          status,
          headers: {
               "Content-Type": "application/json",
               ...headers,
          },
     });
}

/**
 * エラーレスポンスを生成
 * @param message - エラーメッセージ
 * @param options - オプション
 * @returns NextResponse
 */
export function errorResponse(
     message: string,
     options?: {
          status?: number;
          code?: string;
          details?: any;
          headers?: Record<string, string>;
     },
): NextResponse<ApiResponse> {
     const { status = 400, code, details, headers = {} } = options || {};

     const response: ApiResponse = {
          success: false,
          error: {
               message,
               ...(code && { code }),
               ...(details && { details }),
          },
          meta: {
               timestamp: new Date().toISOString(),
          },
     };

     return NextResponse.json(response, {
          status,
          headers: {
               "Content-Type": "application/json",
               ...headers,
          },
     });
}

/**
 * ページネーション付き成功レスポンスを生成
 * @param data - レスポンスデータ
 * @param pagination - ページネーション情報
 * @param options - オプション
 * @returns NextResponse
 */
export function paginatedResponse<T>(
     data: T[],
     pagination: {
          page: number;
          limit: number;
          total: number;
     },
     options?: {
          status?: number;
          meta?: Record<string, any>;
     },
): NextResponse<PaginatedApiResponse<T[]>> {
     const { status = 200, meta = {} } = options || {};
     const { page, limit, total } = pagination;

     const totalPages = Math.ceil(total / limit);

     const response: PaginatedApiResponse<T[]> = {
          success: true,
          data,
          pagination: {
               page,
               limit,
               total,
               totalPages,
               hasNext: page < totalPages,
               hasPrev: page > 1,
          },
          meta: {
               timestamp: new Date().toISOString(),
               ...meta,
          },
     };

     return NextResponse.json(response, { status });
}

/**
 * 作成成功レスポンス（201 Created）
 * @param data - 作成されたデータ
 * @param options - オプション
 * @returns NextResponse
 */
export function createdResponse<T>(
     data: T,
     options?: {
          meta?: Record<string, any>;
          location?: string;
     },
): NextResponse<ApiResponse<T>> {
     const headers: Record<string, string> = {};

     if (options?.location) {
          headers["Location"] = options.location;
     }

     return successResponse(data, {
          status: 201,
          meta: options?.meta,
          headers,
     });
}

/**
 * 削除成功レスポンス（204 No Content）
 * @returns NextResponse
 */
export function deletedResponse(): NextResponse {
     return new NextResponse(null, { status: 204 });
}

/**
 * バリデーションエラーレスポンス（400 Bad Request）
 * @param errors - バリデーションエラー
 * @returns NextResponse
 */
export function validationErrorResponse(
     errors: Record<string, string[]> | string[],
): NextResponse<ApiResponse> {
     return errorResponse("バリデーションエラー", {
          status: 400,
          code: "VALIDATION_ERROR",
          details: { errors },
     });
}

/**
 * 認証エラーレスポンス（401 Unauthorized）
 * @param message - エラーメッセージ
 * @returns NextResponse
 */
export function unauthorizedResponse(
     message: string = "認証が必要です",
): NextResponse<ApiResponse> {
     return errorResponse(message, {
          status: 401,
          code: "UNAUTHORIZED",
     });
}

/**
 * 権限エラーレスポンス（403 Forbidden）
 * @param message - エラーメッセージ
 * @returns NextResponse
 */
export function forbiddenResponse(
     message: string = "アクセス権限がありません",
): NextResponse<ApiResponse> {
     return errorResponse(message, {
          status: 403,
          code: "FORBIDDEN",
     });
}

/**
 * Not Foundレスポンス（404 Not Found）
 * @param message - エラーメッセージ
 * @returns NextResponse
 */
export function notFoundResponse(
     message: string = "リソースが見つかりません",
): NextResponse<ApiResponse> {
     return errorResponse(message, {
          status: 404,
          code: "NOT_FOUND",
     });
}

/**
 * Conflictレスポンス（409 Conflict）
 * @param message - エラーメッセージ
 * @returns NextResponse
 */
export function conflictResponse(
     message: string = "リソースが既に存在します",
): NextResponse<ApiResponse> {
     return errorResponse(message, {
          status: 409,
          code: "CONFLICT",
     });
}

/**
 * レート制限エラーレスポンス（429 Too Many Requests）
 * @param message - エラーメッセージ
 * @param retryAfter - 再試行までの秒数
 * @returns NextResponse
 */
export function rateLimitResponse(
     message: string = "リクエスト数が上限に達しました",
     retryAfter?: number,
): NextResponse<ApiResponse> {
     const headers: Record<string, string> = {};

     if (retryAfter) {
          headers["Retry-After"] = retryAfter.toString();
     }

     return errorResponse(message, {
          status: 429,
          code: "RATE_LIMIT_EXCEEDED",
          headers,
     });
}

/**
 * サーバーエラーレスポンス（500 Internal Server Error）
 * @param message - エラーメッセージ
 * @param details - エラー詳細（開発環境のみ）
 * @returns NextResponse
 */
export function serverErrorResponse(
     message: string = "サーバーエラーが発生しました",
     details?: any,
): NextResponse<ApiResponse> {
     const isDevelopment = process.env.NODE_ENV === "development";

     return errorResponse(message, {
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
          details: isDevelopment ? details : undefined,
     });
}

/**
 * メソッド非対応レスポンス（405 Method Not Allowed）
 * @param allowedMethods - 許可されているメソッド
 * @returns NextResponse
 */
export function methodNotAllowedResponse(
     allowedMethods: string[],
): NextResponse<ApiResponse> {
     return errorResponse("このHTTPメソッドは許可されていません", {
          status: 405,
          code: "METHOD_NOT_ALLOWED",
          headers: {
               Allow: allowedMethods.join(", "),
          },
     });
}
