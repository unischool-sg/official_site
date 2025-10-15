# API Response Functions - 使用ガイド

## 📁 ファイル構成

```
src/lib/api/
├── response.ts      # レスポンス生成関数
├── error.ts         # エラークラスとハンドリング
└── middleware.ts    # 認証・権限ミドルウェア
```

## 🚀 基本的な使い方

### 1. 成功レスポンス

```typescript
// app/api/users/route.ts
import { successResponse } from '@/lib/api/response';

export async function GET() {
  const users = await prisma.user.findMany();
  
  return successResponse(users);
}
```

### 2. エラーレスポンス

```typescript
import { errorResponse, notFoundResponse } from '@/lib/api/response';

export async function GET(request: Request) {
  const user = await prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    return notFoundResponse('ユーザーが見つかりません');
  }
  
  return successResponse(user);
}
```

### 3. ページネーション

```typescript
import { paginatedResponse } from '@/lib/api/response';
import { getPaginationParams } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  const { page, limit, skip } = getPaginationParams(request);
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit }),
    prisma.user.count(),
  ]);
  
  return paginatedResponse(users, { page, limit, total });
}
```

## 🔐 認証付きAPI

### 1. 認証が必要なエンドポイント

```typescript
// app/api/profile/route.ts
import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api/middleware';
import { successResponse } from '@/lib/api/response';

export const GET = withAuth(async (request: NextRequest, context) => {
  // context.user に認証済みユーザー情報が入っている
  const user = context?.user;
  
  return successResponse({
    id: user?.id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
  });
});

// または user.toJSON() を使用してパスワードを除外
export const GET = withAuth(async (request: NextRequest, context) => {
  return successResponse(context?.user?.toJSON());
});
```

### 2. 管理者のみアクセス可能

```typescript
// app/api/admin/users/route.ts
import { withRole } from '@/lib/api/middleware';
import { successResponse } from '@/lib/api/response';

export const GET = withRole(
  async (request, context) => {
    const users = await prisma.user.findMany();
    return successResponse(users);
  },
  ['ADMIN'] // ADMIN ロールのみ許可
);
```

## 📝 完全な例：ユーザーCRUD API

```typescript
// app/api/users/route.ts
import { NextRequest } from 'next/server';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  validationErrorResponse,
} from '@/lib/api/response';
import { withAuth, withRole, getPaginationParams } from '@/lib/api/middleware';
import { validateEmail } from '@/utils/validation';
import { hashPassword } from '@/utils/hash';

// GET /api/users - ユーザー一覧（認証必要）
export const GET = withAuth(async (request: NextRequest) => {
  const { page, limit, skip } = getPaginationParams(request);
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);
  
  return paginatedResponse(users, { page, limit, total });
});

// POST /api/users - ユーザー作成（管理者のみ）
export const POST = withRole(
  async (request: NextRequest) => {
    const body = await request.json();
    const { email, password, name } = body;
    
    // バリデーション
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return validationErrorResponse({ email: emailValidation.errors });
    }
    
    // ユーザー作成
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    return createdResponse(user);
  },
  ['ADMIN']
);
```

## 🛡️ エラーハンドリング

### カスタムエラーを投げる

```typescript
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '@/lib/api/error';
import { withErrorHandler } from '@/lib/api/middleware';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const user = await prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    throw new NotFoundError('ユーザーが見つかりません');
  }
  
  return successResponse(user);
});
```

### Prismaエラーの自動ハンドリング

```typescript
import { withErrorHandler } from '@/lib/api/middleware';

// Prismaエラーは自動的に適切なAPIエラーに変換される
export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  
  const user = await prisma.user.create({
    data: body,
  });
  // P2002 (Unique constraint) -> ConflictError (409)
  // P2025 (Record not found) -> NotFoundError (404)
  // など
  
  return createdResponse(user);
});
```

## 📊 レスポンス形式

### 成功レスポンス

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-10-15T12:00:00.000Z"
  }
}
```

### ページネーション付きレスポンス

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2025-10-15T12:00:00.000Z"
  }
}
```

### エラーレスポンス

```json
{
  "success": false,
  "error": {
    "message": "リソースが見つかりません",
    "code": "NOT_FOUND",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-10-15T12:00:00.000Z"
  }
}
```

## 🎯 ヘルパー関数

### クエリパラメータ取得

```typescript
import { getQueryParam, getNumberParam } from '@/lib/api/middleware';

const search = getQueryParam(request, 'search', '');
const page = getNumberParam(request, 'page', 1);
```

### クライアント情報取得

```typescript
import { getClientIp, getUserAgent } from '@/lib/api/middleware';

const ip = getClientIp(request);
const userAgent = getUserAgent(request);
```

## 📦 レスポンス関数一覧

| 関数 | ステータス | 用途 |
|------|-----------|------|
| `successResponse` | 200 | 成功 |
| `createdResponse` | 201 | 作成成功 |
| `deletedResponse` | 204 | 削除成功 |
| `paginatedResponse` | 200 | ページネーション付き |
| `errorResponse` | 400 | 一般エラー |
| `validationErrorResponse` | 400 | バリデーションエラー |
| `unauthorizedResponse` | 401 | 認証エラー |
| `forbiddenResponse` | 403 | 権限エラー |
| `notFoundResponse` | 404 | Not Found |
| `conflictResponse` | 409 | 競合エラー |
| `rateLimitResponse` | 429 | レート制限 |
| `methodNotAllowedResponse` | 405 | メソッド非対応 |
| `serverErrorResponse` | 500 | サーバーエラー |

## 🔧 ミドルウェア一覧

| ミドルウェア | 機能 |
|------------|------|
| `withAuth` | 認証チェック |
| `withRole` | ロールベース認証 |
| `withErrorHandler` | 自動エラーハンドリング |
