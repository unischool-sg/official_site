# ユーザー管理ページ - 実装ガイド

## 📋 実装内容

### ✨ 機能

#### 1. **ユーザー一覧テーブル**

表示項目：
- 🆔 ID（短縮表示）
- 👤 名前（編集可能）
- 📧 メールアドレス（編集可能）
- 🎭 ロール（ドロップダウン選択）
- 👥 チーム（ドロップダウン選択）
- ✅ 認証ステータス（バッジ表示）
- 🛠️ 操作ボタン（保存・削除）

#### 2. **編集可能なフィールド**

```typescript
// 名前
<Input defaultValue={user.name} className="h-8" />

// メールアドレス
<Input defaultValue={user.email} type="email" className="h-8" />

// ロール
<Select defaultValue={user.role}>
  <SelectItem value="ADMIN">ADMIN</SelectItem>
  <SelectItem value="MEMBER">MEMBER</SelectItem>
</Select>

// チーム
<Select defaultValue={user.team}>
  <SelectItem value="ALL">ALL</SelectItem>
  <SelectItem value="VIDEO">VIDEO</SelectItem>
  <SelectItem value="EDIT">EDIT</SelectItem>
  <SelectItem value="DEVELOP">DEVELOP</SelectItem>
</Select>
```

#### 3. **ステータス表示**

```typescript
{user.emailVerified ? (
  <span className="bg-green-100 text-green-700">認証済み</span>
) : (
  <span className="bg-gray-100 text-gray-700">未認証</span>
)}
```

## 🎨 UI コンポーネント

### 作成したコンポーネント

#### 1. **Table** (`components/ui/table.tsx`)
- `Table` - テーブルコンテナ
- `TableHeader` - ヘッダー
- `TableBody` - ボディ
- `TableRow` - 行
- `TableHead` - ヘッダーセル
- `TableCell` - データセル

#### 2. **Select** (`components/ui/select.tsx`)
- Radix UI ベース
- `Select` - ルート
- `SelectTrigger` - トリガーボタン
- `SelectContent` - ドロップダウンメニュー
- `SelectItem` - 選択肢

## 📊 データ取得

```typescript
const users = await prisma.user.findMany({
  orderBy: {
    createdAt: "desc",
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    team: true,
    createdAt: true,
    emailVerified: true,
  },
});
```

## 🎯 レイアウト

```
┌─────────────────────────────────────────────────────────────┐
│ ユーザー管理                           [+ 新規ユーザー]      │
├─────────────────────────────────────────────────────────────┤
│ ユーザー一覧 (3名)                                           │
├────┬──────┬────────────┬──────┬──────┬────┬─────────────┤
│ ID │ 名前 │ メール      │ ロール│チーム│認証│ 操作        │
├────┼──────┼────────────┼──────┼──────┼────┼─────────────┤
│ cl..│[Input]│[Input]     │[Select]│[Select]│[Badge]│[💾][🗑️] │
│ cl..│[Input]│[Input]     │[Select]│[Select]│[Badge]│[💾][🗑️] │
│ cl..│[Input]│[Input]     │[Select]│[Select]│[Badge]│[💾][🗑️] │
└────┴──────┴────────────┴──────┴──────┴────┴─────────────┘
```

## 🔧 スタイリング

### テーブル

```tsx
<div className="rounded-md border">
  <Table>
    {/* ... */}
  </Table>
</div>
```

### 行のホバー効果

```css
hover:bg-muted/50
```

### セルの高さ

```tsx
className="h-8" // InputとSelectの高さ
```

### IDの短縮表示

```tsx
{user.id.substring(0, 8)}...
```

## 🎨 カラースキーム

### 認証ステータス

```typescript
// 認証済み
bg-green-100 text-green-700

// 未認証
bg-gray-100 text-gray-700
```

### ロールバッジ（将来的に）

```typescript
// ADMIN
bg-red-100 text-red-700

// MEMBER
bg-blue-100 text-blue-700
```

### 操作ボタン

```typescript
// 保存（通常）
variant="ghost"

// 削除（危険）
text-red-600 hover:text-red-700 hover:bg-red-50
```

## 📝 使用例

### 基本的な使い方

```tsx
// app/admin/users/page.tsx
export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          {/* ... */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Input defaultValue={user.name} />
            </TableCell>
            {/* ... */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### フィルタリング（将来的に）

```tsx
// 検索バーを追加
<Input
  placeholder="ユーザーを検索..."
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// フィルタリングロジック
const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  user.email.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## 🚀 今後の実装予定

### 1. **保存機能**

```typescript
// components/user-table-row.tsx (Client Component)
"use client";

const handleSave = async () => {
  const response = await fetch(`/api/users/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({ name, email, role, team }),
  });
  
  if (response.ok) {
    toast.success("保存しました");
  }
};
```

### 2. **削除機能**

```typescript
const handleDelete = async () => {
  if (!confirm("本当に削除しますか？")) return;
  
  const response = await fetch(`/api/users/${user.id}`, {
    method: "DELETE",
  });
  
  if (response.ok) {
    router.refresh();
    toast.success("削除しました");
  }
};
```

### 3. **新規ユーザー作成**

```typescript
// app/admin/users/new/page.tsx
export default function NewUserPage() {
  return (
    <form action="/api/users" method="POST">
      <Input name="email" required />
      <Input name="name" required />
      <Select name="role" />
      <Select name="team" />
      <Button type="submit">作成</Button>
    </form>
  );
}
```

### 4. **ページネーション**

```typescript
const page = searchParams.page || 1;
const pageSize = 10;

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

const totalUsers = await prisma.user.count();
const totalPages = Math.ceil(totalUsers / pageSize);
```

### 5. **ソート機能**

```typescript
const sortBy = searchParams.sortBy || "createdAt";
const sortOrder = searchParams.sortOrder || "desc";

const users = await prisma.user.findMany({
  orderBy: {
    [sortBy]: sortOrder,
  },
});
```

## 🔒 セキュリティ

### Admin権限チェック

```typescript
// layout.tsxで既に実装済み
const user = await User.current();
if (user.role !== "ADMIN") {
  redirect("/403");
}
```

### バリデーション（API側）

```typescript
// app/api/users/[id]/route.ts
export async function PATCH(req: NextRequest, { params }) {
  const user = await User.current();
  if (user.role !== "ADMIN") {
    return unauthorizedResponse();
  }
  
  const { email } = await req.json();
  if (!validateEmail(email)) {
    return errorResponse("無効なメールアドレスです");
  }
  
  // 更新処理
}
```

## ✅ チェックリスト

- ✅ ユーザー一覧表示
- ✅ テーブルレイアウト
- ✅ 編集可能なフィールド（Input/Select）
- ✅ ロール選択（ADMIN/MEMBER）
- ✅ チーム選択（ALL/VIDEO/EDIT/DEVELOP）
- ✅ 認証ステータス表示
- ✅ 操作ボタン（保存/削除）
- ✅ レスポンシブデザイン
- ⏳ 保存ハンドラー（未実装）
- ⏳ 削除ハンドラー（未実装）
- ⏳ 新規作成機能（未実装）

## 📚 依存パッケージ

```json
{
  "@radix-ui/react-select": "^latest",
  "lucide-react": "^latest"
}
```

## 🎉 完成！

これで、管理者がユーザー情報を一覧で確認・編集できるテーブルが完成しました！

**次のステップ:**
1. 保存・削除ハンドラーの実装
2. API ルートの作成
3. バリデーションの追加
4. トースト通知の実装
