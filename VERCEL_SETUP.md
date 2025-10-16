# Vercel デプロイ設定ガイド

## 環境変数の設定

Vercelのダッシュボードで以下の環境変数を設定してください：

### 必須の環境変数

1. **DATABASE_URL**
   ```
   postgresql://neondb_owner:npg_CiPEH37SeDNy@ep-late-smoke-adbrdyoe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **RESEND_API_KEY**
   ```
   re_XvMu4e7D_5zjCb6csbJLPbSwXkPqFyZ4x
   ```

3. **RESEND_FROM_EMAIL**
   ```
   unischool@tanahiro2010.com
   ```

4. **NEXT_PUBLIC_APP_URL** ⚠️ **重要！**
   ```
   https://your-domain.vercel.app
   ```
   または、カスタムドメインを使用する場合：
   ```
   https://yourdomain.com
   ```

5. **NODE_ENV**
   ```
   production
   ```

## Vercelでの設定手順

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. **Settings** → **Environment Variables** に移動
4. 上記の環境変数を追加
5. 各環境変数に対して適用する環境を選択：
   - Production
   - Preview
   - Development

## クッキー設定について

本番環境では以下の設定が自動的に適用されます：

- `httpOnly: true` - XSS攻撃を防ぐ
- `secure: true` - HTTPS接続でのみクッキーを送信
- `sameSite: "lax"` - CSRF攻撃を防ぐ
- `maxAge: 7日間` - セッション有効期間
- `path: "/"` - アプリ全体でクッキーを使用

## トラブルシューティング

### クッキーが保存されない場合

1. **HTTPS接続を確認**
   - Vercelは自動的にHTTPSを提供しますが、カスタムドメインの場合はSSL証明書が正しく設定されているか確認

2. **環境変数を確認**
   - `NEXT_PUBLIC_APP_URL`が正しいHTTPS URLになっているか確認
   - `https://`で始まっていることを確認（`http://`ではない）

3. **ブラウザのクッキー設定**
   - ブラウザでサードパーティクッキーがブロックされていないか確認
   - プライベートモード/シークレットモードではクッキーの動作が異なる場合があります

4. **Vercelのログを確認**
   - Vercelダッシュボードの**Deployments**から最新のデプロイを選択
   - **Functions**タブでログを確認
   - `[Login API] Cookie set in response:` のログを探す

### リダイレクト後にクッキーが消える場合

これは修正済みですが、以下を確認してください：

1. **完全なページリロード**
   - `window.location.href`を使用しているため、クッキーは保持されるはずです

2. **ミドルウェアのログ**
   - `[Middleware] Session token found:` のログが表示されるか確認

3. **セッションの有効期限**
   - データベースの`Session`テーブルを確認
   - `expires`カラムが未来の日時になっているか確認

## デバッグ方法

### 1. ブラウザのDevToolsでクッキーを確認

1. F12でDevToolsを開く
2. **Application** → **Cookies** → あなたのドメイン
3. `s-token`クッキーを探す
4. 属性を確認：
   - `HttpOnly`: ✓
   - `Secure`: ✓
   - `SameSite`: Lax
   - `Path`: /

### 2. ネットワークタブでレスポンスヘッダーを確認

1. F12でDevToolsを開く
2. **Network**タブ
3. `/api/auth/login`リクエストを探す
4. **Response Headers**に`Set-Cookie`ヘッダーがあるか確認

### 3. Vercelのログを確認

```bash
vercel logs --follow
```

または、Vercelダッシュボードから：
1. プロジェクトを選択
2. **Deployments**
3. 最新のデプロイを選択
4. **Functions**タブ
5. `/api/auth/login`の実行ログを確認

## 本番環境での動作確認

1. **ログインテスト**
   ```
   https://your-domain.vercel.app/login
   ```

2. **クッキー確認ページ**
   ```
   https://your-domain.vercel.app/debug/cookies
   ```

3. **保護されたページ**
   ```
   https://your-domain.vercel.app/admin
   ```

## セキュリティベストプラクティス

✅ 実装済み：
- HttpOnly クッキー（XSS防止）
- Secure フラグ（HTTPS強制）
- SameSite=Lax（CSRF防止）
- セッショントークンの暗号化
- パスワードのハッシュ化

## 参考リンク

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [MDN HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
