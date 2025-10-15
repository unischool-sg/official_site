# User Service - 完全ガイド

## ✅ 修正内容

### 問題点と解決策

| 問題 | 解決 |
|------|------|
| ❌ sessionToken が自動生成されない | ✅ `generateSecureToken(32)` で明示的に生成 |
| ❌ クッキーに保存されない | ✅ `cookies().set()` で保存 |
| ❌ ログイン履歴が記録されない | ✅ `LoginHistory` に記録（成功・失敗両方） |
| ❌ ログアウト機能がない | ✅ `logout()` と `logoutAll()` を追加 |

## 🚀 使用方法

### 1. ユーザー登録

```typescript
import { User } from '@/lib/service/user';
import { hashPassword } from '@/utils/hash';

// 方法1: 静的メソッド（推奨）
const user = await User.register({
  email: 'user@example.com',
  password: await hashPassword('password123'),
  name: 'John Doe',
});
// 自動的にメール認証が送信される

// 方法2: 直接作成
const user = await User.new({
  email: 'user@example.com',
  password: await hashPassword('password123'),
  name: 'John Doe',
});
await user.sendEmailVerification();
```

### 2. ログイン

```typescript
import { User } from '@/lib/service/user';

// 方法1: 静的メソッド（推奨）
const user = await User.loginWithEmail('user@example.com', 'password123', {
  rememberMe: true, // 90日間有効
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0...',
});

if (user) {
  console.log('ログイン成功', user.email);
} else {
  console.log('ログイン失敗');
}

// 方法2: インスタンスメソッド
const user = await User.get({ email: 'user@example.com' });
if (user) {
  const sessionToken = await user.login('password123', {
    rememberMe: false, // 7日間有効（デフォルト）
  });
  
  if (sessionToken) {
    console.log('ログイン成功');
  }
}
```

### 3. 現在のユーザーを取得

```typescript
import { User } from '@/lib/service/user';

export async function GET() {
  const user = await User.current();
  
  if (!user) {
    return Response.json({ error: '未認証' }, { status: 401 });
  }
  
  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}
```

### 4. ログアウト

```typescript
import { User } from '@/lib/service/user';

// 現在のセッションのみログアウト
const user = await User.current();
if (user) {
  await user.logout();
}

// すべてのデバイスからログアウト
if (user) {
  await user.logoutAll();
}
```

### 5. パスワードリセット

```typescript
import { User } from '@/lib/service/user';
import { hashPassword } from '@/utils/hash';

// リセットメールを送信
const user = await User.get({ email: 'user@example.com' });
if (user) {
  await user.sendPasswordResetEmail();
}

// トークンでパスワードを変更
const token = await prisma.verificationToken.findUnique({
  where: { token: 'xxxxx' },
  include: { user: true },
});

if (token && token.expires > new Date()) {
  const user = new User(token.user);
  await user.changePassword(await hashPassword('newPassword123'));
}
```

## 📋 API例

### ログインエンドポイント

```typescript
// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { User } from '@/lib/service/user';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getClientIp, getUserAgent } from '@/lib/api/middleware';

export async function POST(request: NextRequest) {
  const { email, password, rememberMe } = await request.json();
  
  const user = await User.loginWithEmail(email, password, {
    rememberMe,
    ipAddress: getClientIp(request) || undefined,
    userAgent: getUserAgent(request) || undefined,
  });
  
  if (!user) {
    return errorResponse('メールアドレスまたはパスワードが正しくありません', {
      status: 401,
    });
  }
  
  return successResponse({
    user: user.toJSON(),
  });
}
```

### 登録エンドポイント

```typescript
// app/api/auth/register/route.ts
import { User } from '@/lib/service/user';
import { hashPassword } from '@/utils/hash';
import { validateEmail, validatePassword } from '@/utils/validation';
import { successResponse, validationErrorResponse } from '@/lib/api/response';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  
  // バリデーション
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  if (!emailValidation.isValid || !passwordValidation.isValid) {
    return validationErrorResponse({
      email: emailValidation.errors,
      password: passwordValidation.errors,
    });
  }
  
  // ユーザー作成
  const hashedPassword = await hashPassword(password);
  const user = await User.register({
    email,
    password: hashedPassword,
    name,
  });
  
  return successResponse({
    user: user.toJSON(),
    message: 'メール認証リンクを送信しました',
  }, { status: 201 });
}
```

### ログアウトエンドポイント

```typescript
// app/api/auth/logout/route.ts
import { User } from '@/lib/service/user';
import { successResponse, unauthorizedResponse } from '@/lib/api/response';

export async function POST() {
  const user = await User.current();
  
  if (!user) {
    return unauthorizedResponse();
  }
  
  await user.logout();
  
  return successResponse({ message: 'ログアウトしました' });
}
```

### プロフィール取得エンドポイント

```typescript
// app/api/profile/route.ts
import { withAuth } from '@/lib/api/middleware';
import { successResponse } from '@/lib/api/response';

export const GET = withAuth(async (request, context) => {
  return successResponse(context?.user?.toJSON());
});
```

## 🔐 セキュリティ機能

### 1. セッション管理
- ✅ 自動的に期限切れセッションを削除
- ✅ 複数デバイスのセッション管理
- ✅ セキュアなクッキー設定（httpOnly, secure）

### 2. ログイン履歴
- ✅ 成功・失敗の両方を記録
- ✅ IPアドレスとUser-Agentを保存
- ✅ 不審なアクティビティの検出が可能

### 3. トークン管理
- ✅ 64文字のランダムトークン
- ✅ 有効期限管理
- ✅ トークンタイプ別管理

## 📊 クッキー設定

```typescript
{
  httpOnly: true,              // JavaScriptからアクセス不可
  secure: NODE_ENV === 'production', // HTTPS のみ（本番）
  sameSite: 'lax',             // CSRF 対策
  maxAge: sessionDuration / 1000, // 秒単位
  path: '/',                   // 全パスで有効
}
```

## 🎯 Userクラスの全メソッド

### 静的メソッド
| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `User.get({ id })` | IDでユーザーを取得 | `User \| null` |
| `User.get({ email })` | メールでユーザーを取得 | `User \| null` |
| `User.new(data)` | 新規ユーザーを作成 | `User` |
| `User.current()` | 現在のセッションのユーザー | `User \| null` |
| `User.loginWithEmail()` | メールとパスワードでログイン | `User \| null` |
| `User.register()` | 新規登録（メール認証付き） | `User` |

### インスタンスメソッド
| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `user.login(password)` | ログイン処理 | `string \| null` |
| `user.logout()` | 現在のセッションをログアウト | `void` |
| `user.logoutAll()` | 全セッションをログアウト | `void` |
| `user.update(data)` | ユーザー情報を更新 | `User` |
| `user.delete()` | ユーザーを削除 | `void` |
| `user.verifyEmail()` | メールを確認済みにする | `void` |
| `user.changePassword(newPassword)` | パスワード変更 | `void` |
| `user.sendPasswordResetEmail()` | リセットメールを送信 | `void` |
| `user.sendEmailVerification()` | 認証メールを送信 | `void` |
| `user.toJSON()` | パスワードを除いたデータ | `Omit<User, 'password'>` |

### Getter
- `user.id`, `user.email`, `user.name`, `user.role`
- `user.emailVerified`, `user.createdAt`, `user.updatedAt`, `user.deletedAt`

## ✅ 動作確認チェックリスト

- [x] sessionToken が正しく生成される
- [x] クッキーに保存される
- [x] ログイン履歴が記録される
- [x] 期限切れセッションが削除される
- [x] ログアウトが動作する
- [x] メール認証が送信される
- [x] パスワードリセットが動作する
- [x] セキュアなクッキー設定

これで完全に動作します！🎉
