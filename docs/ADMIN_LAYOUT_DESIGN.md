# Admin Layout デザインガイド

## 🎨 実装内容

### ✨ 改善されたデザイン

#### 1. **サイドバーヘッダー**

```tsx
<SidebarHeader>
  <Link href="/" className="flex items-center gap-2 p-4">
    <Image src="/assets/logo.png" width={32} height={32} />
    <div>
      <h1>UniSchool</h1>
      <p>管理パネル</p>
    </div>
  </Link>
</SidebarHeader>
```

**特徴:**
- ✅ ロゴとタイトルを表示
- ✅ クリックでホームに戻る
- ✅ 視覚的に分かりやすい

#### 2. **ナビゲーションメニュー**

```tsx
<SidebarMenu>
  <SidebarMenuItem>
    <Link href="/admin" className="flex items-center gap-3">
      <Home className="w-5 h-5" />
      ダッシュボード
    </Link>
  </SidebarMenuItem>
  {/* ... */}
</SidebarMenu>
```

**特徴:**
- ✅ アイコン付きメニュー（lucide-react）
- ✅ ホバーエフェクト
- ✅ アクティブ状態の表示
- ✅ 論理的なグループ分け

**メニュー項目:**
- 🏠 ダッシュボード (`/admin`)
- 👥 ユーザー管理 (`/admin/users`)
- 📄 投稿管理 (`/admin/posts`)
- ⚙️ 設定 (`/admin/settings`)
- 🚪 ログアウト (`/api/auth/logout`)

#### 3. **ユーザー情報フッター**

```tsx
<SidebarFooter>
  <div className="p-4 border-t">
    <div className="flex items-center gap-3">
      {/* アバター */}
      <div className="relative w-10 h-10">
        <Image
          src={user.profile?.avatarUrl ?? "/assets/logo.png"}
          width={40}
          height={40}
          className="rounded-full border-2"
        />
        {/* オンラインステータス */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      
      {/* ユーザー情報 */}
      <div className="flex-1">
        <p className="text-sm font-medium truncate">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10">
          {user.role}
        </span>
      </div>
    </div>
    
    {/* プロフィールの自己紹介 */}
    {user.profile?.bio && (
      <p className="mt-2 text-xs text-gray-600 line-clamp-2">
        {user.profile.bio}
      </p>
    )}
  </div>
</SidebarFooter>
```

**特徴:**
- ✅ プロフィール画像（丸型）
- ✅ オンラインステータス（緑の点）
- ✅ ユーザー名・メールアドレス
- ✅ ロールバッジ
- ✅ 自己紹介文（2行省略）

## 🎯 デザインの特徴

### カラースキーム

```css
- Primary: テーマカラー
- Gray-900: メインテキスト
- Gray-700: サブテキスト
- Gray-500: メタ情報
- Gray-200: ボーダー
- Gray-100: ホバー背景
- Green-500: オンラインステータス
- Red-600: 危険なアクション（ログアウト）
```

### スペーシング

```
- Header: p-4 (16px)
- Menu Items: px-4 py-3
- Footer: p-4
- Gap: gap-2, gap-3
```

### アイコン

```tsx
import { Home, Users, Settings, FileText, LogOut } from "lucide-react";
```

**サイズ:** `w-5 h-5` (20x20px)

### トランジション

```css
hover:bg-gray-100 hover:text-primary transition-colors
```

## 📱 レスポンシブ

```tsx
<div className="flex w-full min-h-screen">
  <Sidebar /> {/* 固定幅 */}
  <main className="flex-1">{children}</main> {/* 可変幅 */}
</div>
```

## 🔐 セキュリティ

### 認証チェック

```typescript
const user = await User.current(true); // プロフィール込み

if (!user) {
  redirect("/login?redirect=/admin");
}

if (user.role !== "ADMIN") {
  redirect("/403");
}
```

**チェック項目:**
1. ✅ ログイン済みか
2. ✅ ADMINロールを持っているか

## 🚀 使用例

### プロフィール画像の設定

```typescript
// ユーザーがプロフィール画像をアップロード
const user = await User.current();
await user.upsertProfile({
  avatarUrl: "https://example.com/avatar.jpg",
  bio: "Web開発エンジニア"
});

// 自動的にサイドバーに反映される
```

### カスタムメニューアイテム

```tsx
<SidebarMenuItem>
  <Link
    href="/admin/custom"
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-lg mx-2"
  >
    <CustomIcon className="w-5 h-5" />
    カスタム機能
  </Link>
</SidebarMenuItem>
```

## 🎨 スタイリングのカスタマイズ

### ホバーカラーの変更

```tsx
className="hover:bg-blue-100 hover:text-blue-600"
```

### アバターの形状変更

```tsx
// 丸型（デフォルト）
className="rounded-full"

// 角丸
className="rounded-lg"

// 正方形
className="rounded-none"
```

### ロールバッジのカラー

```tsx
{user.role === "ADMIN" && (
  <span className="bg-red-100 text-red-600">ADMIN</span>
)}
{user.role === "MEMBER" && (
  <span className="bg-blue-100 text-blue-600">MEMBER</span>
)}
```

## 📊 コンポーネント構造

```
AdminLayout
├── SidebarProvider
│   ├── Sidebar
│   │   ├── SidebarHeader
│   │   │   └── Logo + Title
│   │   ├── SidebarContent
│   │   │   └── SidebarMenu
│   │   │       └── SidebarMenuItem × N
│   │   └── SidebarFooter
│   │       └── UserProfile
│   └── main
│       └── {children}
```

## ✅ 完成イメージ

```
┌─────────────────────┬──────────────────────────┐
│ 🏠 UniSchool        │                          │
│    管理パネル        │                          │
├─────────────────────┤                          │
│ 🏠 ダッシュボード     │                          │
│ 👥 ユーザー管理      │       Main Content       │
│ 📄 投稿管理         │                          │
│ ⚙️ 設定             │                          │
├─────────────────────┤                          │
│ 🚪 ログアウト        │                          │
├─────────────────────┤                          │
│ 🟢 Kirito          │                          │
│    kirito@uni.jp   │                          │
│    [ADMIN]         │                          │
└─────────────────────┴──────────────────────────┘
```

## 🎉 完成！

これで管理画面のサイドバーが「いい感じ」になりました！

- ✅ モダンなデザイン
- ✅ 視認性の高いアイコン
- ✅ ユーザー情報の詳細表示
- ✅ プロフィール画像対応
- ✅ オンラインステータス
- ✅ ホバーエフェクト
- ✅ レスポンシブ対応
