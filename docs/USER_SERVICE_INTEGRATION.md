# User Service 統合完了

## ✅ 変更内容

### 1. `src/lib/api/middleware.ts`
- ❌ `getSession` from `@/lib/auth/session` を削除
- ✅ `User` from `@/lib/service/user` を使用
- ✅ `User.current()` でセッション取得

### 2. `src/lib/service/user.ts`
- ✅ Getter メソッドを追加
  - `id`, `email`, `name`, `role`
  - `emailVerified`, `createdAt`, `updatedAt`, `deletedAt`
- ✅ `toJSON()` メソッドを追加（パスワードを除外）

## 📝 使用方法

### 認証が必要なAPIエンドポイント

```typescript
import { withAuth } from '@/lib/api/middleware';
import { successResponse } from '@/lib/api/response';

export const GET = withAuth(async (request, context) => {
  // context.user は User クラスのインスタンス
  const user = context?.user;
  
  // Getter を使用してアクセス
  console.log(user?.id);
  console.log(user?.email);
  console.log(user?.role);
  
  // または toJSON() でパスワードなしのオブジェクトを取得
  return successResponse(user?.toJSON());
});
```

### ロールベース認証

```typescript
import { withRole } from '@/lib/api/middleware';

export const GET = withRole(
  async (request, context) => {
    // ADMIN ロールのユーザーのみアクセス可能
    return successResponse({ message: 'Admin only' });
  },
  ['ADMIN']
);
```

### 現在のユーザーを直接取得

```typescript
import { User } from '@/lib/service/user';

export async function GET() {
  const user = await User.current();
  
  if (!user) {
    return errorResponse('未認証', { status: 401 });
  }
  
  return successResponse({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}
```

## 🎯 利点

1. ✅ **統一されたユーザー管理**: すべてのコードが `User` クラスを使用
2. ✅ **型安全性**: TypeScriptの型チェックが効く
3. ✅ **カプセル化**: パスワードなど機密情報への直接アクセスを防止
4. ✅ **保守性**: ユーザー関連のロジックが一箇所に集約

## 🔄 マイグレーション

古いコード:
```typescript
import { getSession } from '@/lib/auth/session';

const session = await getSession(token);
const userId = session.user.id;
```

新しいコード:
```typescript
import { User } from '@/lib/service/user';

const user = await User.current();
const userId = user?.id;
```

## 📚 User クラスの主なメソッド

| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `User.current()` | 現在のセッションからユーザーを取得 | `User \| null` |
| `User.get({ id })` | IDでユーザーを取得 | `User \| null` |
| `User.new(data)` | 新規ユーザーを作成 | `User` |
| `user.login(password)` | ログイン処理 | `string \| null` (session token) |
| `user.update(data)` | ユーザー情報を更新 | `User` |
| `user.delete()` | ユーザーを削除 | `void` |
| `user.toJSON()` | パスワードを除いたデータを取得 | `Omit<User, 'password'>` |

## 🔐 セキュリティ

- ✅ パスワードは `private data` に保存され、外部からアクセス不可
- ✅ `toJSON()` で自動的にパスワードを除外
- ✅ Getter メソッドで必要なプロパティのみ公開
