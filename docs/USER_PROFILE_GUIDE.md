# User Profile 取得ガイド

## 📋 実装内容

### 追加されたメソッド

#### 1. `user.getProfile()` - プロフィール取得

```typescript
const user = await User.get({ email: "user@example.com" });
const profile = await user.getProfile();

console.log(profile?.bio);
console.log(profile?.avatarUrl);
```

#### 2. `user.upsertProfile(data)` - プロフィール作成/更新

```typescript
const user = await User.current();
const profile = await user.upsertProfile({
  bio: "こんにちは！よろしくお願いします。",
  avatarUrl: "https://example.com/avatar.jpg"
});
```

#### 3. `User.get(data, includeProfile)` - プロフィールを含めて取得

```typescript
// プロフィールなし（デフォルト）
const user1 = await User.get({ email: "user@example.com" });

// プロフィール込み
const user2 = await User.get({ email: "user@example.com" }, true);
console.log(user2.profile?.bio);
```

#### 4. `User.current(includeProfile)` - 現在のユーザーをプロフィール込みで取得

```typescript
// プロフィールなし（デフォルト）
const user1 = await User.current();

// プロフィール込み
const user2 = await User.current(true);
console.log(user2.profile?.bio);
```

## 🎯 使用例

### 例1: プロフィールページの表示

```typescript
// app/profile/page.tsx
import { User } from "@/lib/service/user";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // プロフィール込みで取得
  const user = await User.current(true);
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Team: {user.team}</p>
      
      {user.profile && (
        <div>
          <h2>プロフィール</h2>
          <p>{user.profile.bio}</p>
          {user.profile.avatarUrl && (
            <img src={user.profile.avatarUrl} alt="Avatar" />
          )}
        </div>
      )}
    </div>
  );
}
```

### 例2: プロフィール編集API

```typescript
// app/api/profile/route.ts
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";
import { successResponse, unauthorizedResponse } from "@/lib/api/response";

export async function PUT(request: NextRequest) {
  const user = await User.current();
  
  if (!user) {
    return unauthorizedResponse("ログインが必要です");
  }

  const { bio, avatarUrl } = await request.json();

  // プロフィールを作成/更新
  const profile = await user.upsertProfile({
    bio,
    avatarUrl,
  });

  return successResponse({
    profile,
    message: "プロフィールを更新しました"
  });
}
```

### 例3: プロフィール作成フォーム

```typescript
// components/profile-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function ProfileForm({ profile }: { profile?: any }) {
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio, avatarUrl }),
      });

      if (response.ok) {
        alert("プロフィールを更新しました");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>自己紹介</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹介を入力してください"
        />
      </div>

      <div>
        <label>アバターURL</label>
        <Input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </form>
  );
}
```

### 例4: ユーザー一覧（プロフィール込み）

```typescript
// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  // Prismaで直接取得（複数ユーザー + プロフィール）
  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h1>ユーザー一覧</h1>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>メール</th>
            <th>自己紹介</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.profile?.bio || "未設定"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 📊 メソッド比較

| メソッド | 用途 | プロフィール | パフォーマンス |
|---------|------|------------|--------------|
| `User.current()` | 現在のユーザー | ❌ | 高速 |
| `User.current(true)` | 現在のユーザー | ✅ | 普通 |
| `user.getProfile()` | プロフィールのみ | ✅ | 普通 |
| `user.upsertProfile()` | 作成/更新 | ✅ | 普通 |

## 🎯 ベストプラクティス

### 1. パフォーマンス最適化

```typescript
// ❌ BAD: 2回DBアクセス
const user = await User.current();
const profile = await user.getProfile();

// ✅ GOOD: 1回DBアクセス
const user = await User.current(true);
const profile = user.profile;
```

### 2. 条件付きプロフィール取得

```typescript
// プロフィールが必要な場合のみ includeProfile: true
if (needsProfile) {
  const user = await User.current(true);
} else {
  const user = await User.current();
}
```

### 3. Null チェック

```typescript
const user = await User.current(true);

if (user?.profile) {
  console.log(user.profile.bio);
} else {
  console.log("プロフィール未設定");
}
```

## 🔧 データベーススキーマ

```prisma
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  name     String
  // ...
  
  profile  Profile?  // 1対1リレーション
}

model Profile {
  id        String  @id @default(cuid())
  userId    String  @unique
  bio       String? @db.Text
  avatarUrl String? @db.VarChar(500)
  
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## ✅ まとめ

- ✅ `user.getProfile()` でプロフィール取得
- ✅ `user.upsertProfile(data)` で作成/更新
- ✅ `User.current(true)` で一度に取得（推奨）
- ✅ `user.profile` getterで直接アクセス
- ✅ 型安全で null チェック可能

これでUserからProfileを簡単に取得できます！🎉
