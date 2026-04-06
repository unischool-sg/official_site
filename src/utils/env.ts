/**
 * 環境変数を安全に取得するヘルパー関数
 */

/**
 * 必須の環境変数を取得（存在しない場合はエラー）
 * @param key - 環境変数名
 * @returns 環境変数の値
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }
  return value;
}

/**
 * オプショナルな環境変数を取得
 * @param key - 環境変数名
 * @param defaultValue - デフォルト値
 * @returns 環境変数の値またはデフォルト値
 */
export function getOptionalEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

/**
 * 環境変数をbooleanとして取得
 * @param key - 環境変数名
 * @param defaultValue - デフォルト値
 * @returns boolean値
 */
export function getBooleanEnv(
  key: string,
  defaultValue: boolean = false,
): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * 環境変数を数値として取得
 * @param key - 環境変数名
 * @param defaultValue - デフォルト値
 * @returns 数値
 */
export function getNumberEnv(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 現在の環境を取得
 */
export function getEnvironment(): "development" | "production" | "test" {
  const env = process.env.NODE_ENV || "development";
  if (env === "production" || env === "test") return env;
  return "development";
}

/**
 * 本番環境かどうか
 */
export function isProduction(): boolean {
  return getEnvironment() === "production";
}

/**
 * 開発環境かどうか
 */
export function isDevelopment(): boolean {
  return getEnvironment() === "development";
}

/**
 * Vercel環境かどうか
 */
export function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

/**
 * アプリケーションのベースURLを取得
 */
export function getAppUrl(): string {
  // 環境変数から取得
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Vercel環境の場合
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // ローカル環境
  return "http://localhost:3000";
}

/**
 * データベースURLを取得（プーリング対応）
 */
export function getDatabaseUrl(): string {
  // 本番環境ではプーリングURLを使用
  if (isProduction() && process.env.DATABASE_URL_POOLED) {
    return process.env.DATABASE_URL_POOLED;
  }

  return getRequiredEnv("DATABASE_URL");
}

/**
 * すべての必須環境変数をチェック
 */
export function validateEnvironment(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = [
    "DATABASE_URL",
    // 他の必須変数を追加
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}
