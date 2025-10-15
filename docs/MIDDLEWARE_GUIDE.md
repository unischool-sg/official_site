# Middleware 認証設定ガイド

## 📁 実装したファイル

```
src/
├── middleware.ts              # シンプル版（推奨）
├── middleware.advanced.ts     # 高度版（DBチェック付き）
└── app/
    └── 403/
        └── page.tsx          # 403 Forbiddenページ
```

## 🛡️ 2つのバージョン

### 1. シンプル版（`middleware.ts`）- 推奨

**特徴:**
- ✅ セッショントークンの存在のみチェック
- ✅ 高速（DBアクセスなし）
- ✅ コールドスタートが速い
- ⚠️ セッションの有効期限やロールはチェックしない

**使用ケース:**
- パフォーマンスを重視
- 詳細な認証はページコンポーネントで行う

### 2. 高度版（`middleware.advanced.ts`）

**特徴:**
- ✅ セッションの有効性をDBで確認
- ✅ ユーザーロールをチェック（ADMINのみ）
- ✅ 削除済みユーザーをブロック
- ⚠️ DBアクセスによるオーバーヘッド

**使用ケース:**
- 厳密なセキュリティが必要
- 管理者専用ページの保護

## 🚀 使用方法

### シンプル版を使う（デフォルト）

すでに`src/middleware.ts`として配置されています。そのまま使用できます。

```typescript
// src/middleware.ts
// /admin にアクセスするにはログインが必要
```

### 高度版に切り替える

```bash
# シンプル版をバックアップ
mv src/middleware.ts src/middleware.simple.ts

# 高度版を使用
mv src/middleware.advanced.ts src/middleware.ts
```

## 📝 動作フロー

### シンプル版

```
ユーザーが /admin にアクセス
    ↓
セッショントークンはある？
    ├─ NO → /login?redirect=/admin にリダイレクト
    └─ YES → アクセス許可
```

### 高度版

```
ユーザーが /admin にアクセス
    ↓
セッショントークンはある？
    ├─ NO → /login?redirect=/admin にリダイレクト
    └─ YES
        ↓
    DBでセッションを確認
        ↓
    セッションは有効？
        ├─ NO → /login?redirect=/admin にリダイレクト
        └─ YES
            ↓
        ユーザーは削除されていない？
            ├─ NO → /login?redirect=/admin にリダイレクト
            └─ YES
                ↓
            ユーザーはADMIN？
                ├─ NO → /403 にリダイレクト
                └─ YES → アクセス許可
```

## 🔧 カスタマイズ

### 1. 保護するパスを変更

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin だけでなく /dashboard も保護
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    // 認証チェック
  }
}
```

### 2. ロール別アクセス制御

```typescript
// middleware.advanced.ts
// 管理者権限チェック
if (pathname.startsWith("/admin")) {
  if (session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", request.url));
  }
}

// メンバーページは全ロールOK
if (pathname.startsWith("/member")) {
  // ログイン済みならOK
}
```

### 3. リダイレクト先をカスタマイズ

```typescript
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const loginUrl = new URL("/auth/signin", request.url); // カスタムログインURL
  loginUrl.searchParams.set("from", pathname);
  loginUrl.searchParams.set("message", "ログインが必要です");
  return NextResponse.redirect(loginUrl);
}
```

## 📋 ログイン後のリダイレクト処理

ログインページで`redirect`パラメータを処理します：

```typescript
// app/login/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async () => {
    // ログイン処理
    const success = await loginUser(email, password);
    
    if (success) {
      // 元のページにリダイレクト
      router.push(redirectTo);
    }
  };
}
```

## ⚡ パフォーマンス考慮

### シンプル版の利点

- **コールドスタート**: ~50ms
- **通常実行**: ~1-5ms
- **DBアクセス**: なし

### 高度版のコスト

- **コールドスタート**: ~200-500ms（Prisma初期化）
- **通常実行**: ~10-50ms（DBクエリ）
- **DBアクセス**: 1回/リクエスト

### 推奨アプローチ

**Middlewareでは軽量チェックのみ、詳細はページで:**

```typescript
// middleware.ts - シンプル版を使用
// セッショントークンの存在のみチェック

// app/admin/page.tsx - 詳細チェック
import { User } from '@/lib/service/user';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await User.current();
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/403');
  }
  
  // 管理者用コンテンツ
}
```

## 🎯 ベストプラクティス

1. **Middlewareは軽量に保つ**
   - 基本的なチェックのみ
   - DBアクセスは最小限に

2. **詳細な認証はServer Componentで**
   - ロールチェック
   - 権限チェック
   - データアクセス制御

3. **適切なエラーページ**
   - 401: 未認証 → `/login`
   - 403: 権限不足 → `/403`
   - 404: Not Found → `/404`

4. **セキュリティヘッダー**
   ```typescript
   const response = NextResponse.next();
   response.headers.set('X-Frame-Options', 'DENY');
   response.headers.set('X-Content-Type-Options', 'nosniff');
   return response;
   ```

## ✅ テスト方法

### 1. ログインしていない状態
```bash
# /admin にアクセス
→ /login?redirect=/admin にリダイレクト
```

### 2. ログイン済み（MEMBER）
```bash
# /admin にアクセス
→ シンプル版: アクセス可能
→ 高度版: /403 にリダイレクト
```

### 3. ログイン済み（ADMIN）
```bash
# /admin にアクセス
→ アクセス可能
```

## 📚 関連ドキュメント

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [User Service Guide](./USER_SERVICE_GUIDE.md)
- [API Response Guide](../src/lib/api/README.md)
