import { randomBytes, createHash } from "crypto";

/**
 * セキュアなランダムトークンを生成
 * @param length - バイト数（デフォルト: 32）
 * @returns ランダムなトークン（16進数文字列）
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * セキュアなランダムトークン（Base64URL形式）を生成
 * @param length - バイト数（デフォルト: 32）
 * @returns ランダムなトークン（Base64URL形字列）
 */
export function generateSecureTokenBase64(length: number = 32): string {
  return randomBytes(length)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * 数字のみのワンタイムコードを生成（2FAなどに使用）
 * @param length - コードの長さ（デフォルト: 6）
 * @returns 数字のみのコード
 */
export function generateNumericCode(length: number = 6): string {
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let code = "";
  for (let i = 0; i < length; i++) {
    code += randomValues[i] % 10;
  }

  return code;
}

/**
 * 文字列をSHA-256でハッシュ化
 * @param data - ハッシュ化する文字列
 * @returns ハッシュ値（16進数文字列）
 */
export function sha256Hash(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

/**
 * メールアドレスからGravatarのURLを生成
 * @param email - メールアドレス
 * @param size - 画像サイズ（デフォルト: 200）
 * @returns GravatarのURL
 */
export function generateGravatarUrl(email: string, size: number = 200): string {
  const hash = createHash("md5")
    .update(email.toLowerCase().trim())
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/**
 * セッショントークンを生成
 * @returns セッショントークン
 */
export function generateSessionToken(): string {
  return generateSecureToken(32);
}

/**
 * CSRFトークンを生成
 * @returns CSRFトークン
 */
export function generateCsrfToken(): string {
  return generateSecureToken(32);
}

/**
 * APIキーを生成
 * @param prefix - プレフィックス（例: 'sk_live_'）
 * @returns APIキー
 */
export function generateApiKey(prefix: string = "sk_"): string {
  const token = generateSecureToken(32);
  return `${prefix}${token}`;
}

/**
 * ランダムなユーザー名を生成
 * @param baseUsername - ベースとなるユーザー名
 * @returns ランダム化されたユーザー名
 */
export function generateRandomUsername(baseUsername: string): string {
  const randomSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${baseUsername}${randomSuffix}`;
}

/**
 * トークンの有効期限を計算
 * @param minutes - 分数
 * @returns 有効期限のDate
 */
export function calculateTokenExpiry(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * トークンが有効かチェック
 * @param expiryDate - 有効期限
 * @returns 有効ならtrue
 */
export function isTokenValid(expiryDate: Date): boolean {
  return expiryDate > new Date();
}

/**
 * IPアドレスをハッシュ化（プライバシー保護）
 * @param ipAddress - IPアドレス
 * @returns ハッシュ化されたIPアドレス
 */
export function hashIpAddress(ipAddress: string): string {
  // 日付ごとに異なるソルトを使用（分析は可能だが、完全な特定は困難）
  const dateSalt = new Date().toISOString().split("T")[0];
  return sha256Hash(`${ipAddress}:${dateSalt}`);
}

/**
 * ランダムな色を生成（アバター用など）
 * @returns HEXカラーコード
 */
export function generateRandomColor(): string {
  const randomValues = new Uint32Array(3);
  crypto.getRandomValues(randomValues);

  const r = randomValues[0] % 256;
  const g = randomValues[1] % 256;
  const b = randomValues[2] % 256;

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * ファイル名を安全にサニタイズ
 * @param filename - 元のファイル名
 * @returns サニタイズされたファイル名
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

/**
 * UUIDを生成（v4）
 * @returns UUID
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
