# Edge Runtime 互換性ガイド

## 🚀 概要

Next.js Middlewareは**Edge Runtime**で実行されるため、Node.js固有のモジュールは使用できません。
このガイドでは、Edge Runtime対応のためのベストプラクティスを説明します。

## ⚠️ 使えないNode.jsモジュール

### ❌ 使えないもの
```typescript
import { randomBytes, createHash } from "crypto"; // ❌ Node.js crypto
import fs from "fs";                              // ❌ ファイルシステム
import path from "path";                          // ❌ パス操作（一部のみ）
import { exec } from "child_process";             // ❌ プロセス実行
```

### ✅ 代わりに使えるもの
```typescript
// Web標準のCrypto API
crypto.getRandomValues()        // ランダム生成
crypto.subtle.digest()          // ハッシュ化

// Web標準のAPI
fetch()                         // HTTP リクエスト
URL()                          // URL操作
TextEncoder/TextDecoder        // テキストエンコーディング
```

## 🔧 実装した修正

### 1. ランダムトークン生成

#### Before（Node.js）
```typescript
import { randomBytes } from "crypto";

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}
```

#### After（Edge Runtime対応）
```typescript
export function generateSecureToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
```

### 2. SHA-256 ハッシュ化

#### Before（Node.js）
```typescript
import { createHash } from "crypto";

export function sha256Hash(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}
```

#### After（Edge Runtime対応）
```typescript
export async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
```

**注意**: `crypto.subtle.digest`は非同期なので、`async/await`が必要です。

### 3. Base64URL エンコーディング

#### Before（Node.js）
```typescript
import { randomBytes } from "crypto";

export function generateSecureTokenBase64(length: number = 32): string {
  return randomBytes(length)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
```

#### After（Edge Runtime対応）
```typescript
export function generateSecureTokenBase64(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  // Base64エンコード
  const base64 = btoa(String.fromCharCode(...bytes));
  // Base64URLに変換
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
```

## 📋 対応済み関数一覧

| 関数名 | 変更内容 | 非同期化 |
|--------|---------|---------|
| `generateSecureToken()` | `randomBytes` → `crypto.getRandomValues()` | ❌ |
| `generateSecureTokenBase64()` | `randomBytes` → `crypto.getRandomValues()` + `btoa()` | ❌ |
| `generateNumericCode()` | 元々Web標準API使用 | ❌ |
| `sha256Hash()` | `createHash` → `crypto.subtle.digest()` | ✅ |
| `generateGravatarUrl()` | `sha256Hash()`を使用（非同期化） | ✅ |
| `hashIpAddress()` | `sha256Hash()`を使用（非同期化） | ✅ |

## 🎯 ベストプラクティス

### 1. Middlewareでは軽量な処理のみ

```typescript
// ✅ GOOD: セッショントークンの存在確認のみ
export async function middleware(request: NextRequest) {
  const user = await User.current();
  if (!user) {
    return redirectToLogin(request);
  }
  return NextResponse.next();
}
```

```typescript
// ❌ BAD: 重い処理（データベースクエリ、複雑な計算）
export async function middleware(request: NextRequest) {
  const sessions = await prisma.session.findMany(); // 遅い！
  const hash = await sha256Hash(veryLongString);    // 重い！
  // ...
}
```

### 2. 重い処理はページコンポーネントで

```typescript
// app/admin/page.tsx
import { User } from '@/lib/service/user';

export default async function AdminPage() {
  const user = await User.current();
  
  // ここで詳細なチェックや重い処理を行う
  if (user.role !== 'ADMIN') {
    redirect('/403');
  }
  
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { blogs: true }
  });
  
  return <div>{/* ... */}</div>;
}
```

### 3. 非同期関数の扱い

```typescript
// ❌ BAD: awaitを忘れる
const hash = sha256Hash(data); // Promise<string> が返る

// ✅ GOOD: awaitを使う
const hash = await sha256Hash(data); // string が返る
```

## 🔍 トラブルシューティング

### エラー: "A Node.js module is loaded which is not supported in the Edge Runtime"

**原因**: Node.js固有のモジュールをimportしている

**解決策**:
1. `crypto.getRandomValues()`などWeb標準APIに置き換え
2. Edge Runtime対応のライブラリに変更
3. そのコードをAPI RouteやServer Componentに移動

### エラー: "crypto is not defined"

**原因**: グローバルな`crypto`オブジェクトを参照しようとしている

**解決策**:
```typescript
// Edge Runtimeではグローバルに存在
const bytes = new Uint8Array(32);
crypto.getRandomValues(bytes);
```

### パフォーマンスの低下

**原因**: Middlewareで重い処理（DBクエリ、複雑な計算）を実行

**解決策**:
1. Middlewareは認証チェックのみに限定
2. 詳細なチェックはページコンポーネントで実行
3. キャッシュを活用

## 📚 参考リンク

- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Middleware Best Practices](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## ✅ 対応完了

- ✅ `src/utils/token.ts`をEdge Runtime対応に修正
- ✅ Node.js `crypto`モジュールの依存を削除
- ✅ Web標準の`crypto` APIに置き換え
- ✅ 非同期関数の適切な処理
- ✅ 型エラーの解消
- ✅ Middlewareでの動作確認

これで、Next.js MiddlewareがEdge Runtimeで正常に動作します！
