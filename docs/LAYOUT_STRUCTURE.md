# Layout 構造ガイド

## 📁 レイアウト構造

```
src/app/
├── layout.tsx              # Root Layout（HTML構造のみ）
├── (main)/                 # 通常ページグループ
│   ├── layout.tsx         # Header + Footer
│   └── page.tsx           # ホームページ
├── admin/                  # 管理ページ
│   ├── layout.tsx         # Sidebar（認証チェック付き）
│   └── page.tsx           # 管理ダッシュボード
├── login/
│   └── page.tsx           # ログインページ
└── 403/
    └── page.tsx           # Forbiddenページ
```

## 🎯 レイアウトの役割

### 1. Root Layout (`app/layout.tsx`)

**役割:** HTML構造とグローバル設定のみ

```typescript
export default async function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}  {/* ここに各レイアウトが入る */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**特徴:**
- ✅ HTML/Bodyタグの管理
- ✅ グローバルスタイル
- ✅ フォント設定
- ✅ Analytics
- ❌ Header/Footerは含まない

### 2. Main Layout (`app/(main)/layout.tsx`)

**役割:** 通常ページのHeader + Footer

```typescript
export default async function MainLayout({ children }) {
  const user = await User.current();

  return (
    <div className="pt-3 mx-auto flex font-sans flex-col">
      <BlurFade delay={0.4} inView>
        <Header user={user} />
      </BlurFade>
      <main>{children}</main>
      <BlurFade delay={0.4} inView>
        <Footer user={user} />
      </BlurFade>
    </div>
  );
}
```

**適用ページ:**
- `/` - ホームページ
- `/blogs` - ブログ一覧
- その他の公開ページ

### 3. Admin Layout (`app/admin/layout.tsx`)

**役割:** 管理ページのSidebar + 認証

```typescript
export default async function AdminLayout({ children }) {
  const user = await User.current();
  
  // 認証チェック
  if (!user) redirect("/login?redirect=/admin");

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
```

**適用ページ:**
- `/admin` - ダッシュボード
- `/admin/users` - ユーザー管理
- `/admin/posts` - 投稿管理

## 🔑 Route Groups とは？

### `(main)` の意味

- `()` で囲まれたフォルダ = **Route Group**
- URLには影響しない
- レイアウトをグループ化するためだけに使用

```
/app/(main)/page.tsx    → URL: /
/app/(main)/about/page.tsx → URL: /about
```

**利点:**
- ✅ レイアウトを分離できる
- ✅ URLパスは変わらない
- ✅ コードが整理される

## 📊 レイアウトの継承

```
Root Layout (HTML/Body)
  │
  ├─ Main Layout (Header/Footer)
  │   └─ Home Page
  │
  ├─ Admin Layout (Sidebar)
  │   └─ Admin Pages
  │
  └─ Login Page (レイアウトなし)
```

## ✅ なぜ `/admin` でHeaderが表示されないのか？

### 以前の問題

```typescript
// Root Layout に Header/Footer があった
<div>
  {!isAdminPage && <Header />}  // pathname チェック
  <main>{children}</main>
  {!isAdminPage && <Footer />}
</div>
```

**問題点:**
- ⚠️ クライアント側ナビゲーションで `pathname` が更新されない
- ⚠️ キャッシュの問題
- ⚠️ SSRとCSRの不一致

### 現在の解決策

```typescript
// Root Layout - シンプル
<body>{children}</body>

// Main Layout - Header/Footer
<div>
  <Header />
  {children}
  <Footer />
</div>

// Admin Layout - Sidebar
<div>
  <Sidebar />
  {children}
</div>
```

**メリット:**
- ✅ 完全に分離された構造
- ✅ 条件分岐不要
- ✅ キャッシュの問題なし
- ✅ Next.jsの推奨パターン

## 🚀 ページ追加方法

### 通常ページを追加

```bash
# Header/Footerが必要な場合
src/app/(main)/about/page.tsx  # URL: /about
```

### 管理ページを追加

```bash
# Sidebarが必要な場合
src/app/admin/users/page.tsx  # URL: /admin/users
```

### 独立ページを追加

```bash
# Header/Footerが不要な場合
src/app/special/page.tsx  # URL: /special
```

## 📝 ベストプラクティス

1. **Root Layoutはシンプルに**
   - HTML/Body構造のみ
   - グローバル設定のみ

2. **Route Groupsで整理**
   - `(main)` - 公開ページ
   - `(admin)` - 管理ページ
   - `(auth)` - 認証ページ

3. **認証チェックはLayoutで**
   - Admin Layoutで認証
   - ページごとにチェック不要

4. **`<Link>`を使う**
   - `<a>`タグではなく`<Link>`
   - クライアント側ナビゲーション
   - 高速なページ遷移

## 🎯 結論

`/admin`でHeaderが表示されない理由：
- ✅ Admin Layoutは独立している
- ✅ Main Layoutは`(main)`グループのみ適用
- ✅ Root Layoutには何も含まれていない
- ✅ 完全に分離された構造

これがNext.js App Routerの推奨パターンです！
