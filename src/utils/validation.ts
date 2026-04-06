/**
 * メールアドレスをバリデーション
 * @param email - チェックするメールアドレス
 * @returns 有効ならtrue
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * メールアドレスを詳細にバリデーション
 * @param email - チェックするメールアドレス
 * @returns バリデーション結果
 */
export function validateEmail(email: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 空チェック
  if (!email || email.trim() === "") {
    errors.push("メールアドレスを入力してください");
    return { isValid: false, errors };
  }

  // 長さチェック
  if (email.length > 254) {
    errors.push("メールアドレスが長すぎます");
  }

  // 基本的なフォーマットチェック
  if (!isValidEmail(email)) {
    errors.push("有効なメールアドレスを入力してください");
  }

  // @の前後チェック
  const parts = email.split("@");
  if (parts.length !== 2) {
    errors.push("メールアドレスの形式が正しくありません");
  } else {
    const [localPart, domain] = parts;

    // ローカルパートのチェック
    if (localPart.length === 0) {
      errors.push("メールアドレスの@の前が空です");
    }
    if (localPart.length > 64) {
      errors.push("メールアドレスの@の前が長すぎます");
    }

    // ドメインのチェック
    if (domain.length === 0) {
      errors.push("ドメインが空です");
    }
    if (!domain.includes(".")) {
      errors.push("有効なドメインを入力してください");
    }

    // 連続するドットのチェック
    if (email.includes("..")) {
      errors.push("連続するドットは使用できません");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * ユーザー名をバリデーション
 * @param username - チェックするユーザー名
 * @returns バリデーション結果
 */
export function validateUsername(username: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 空チェック
  if (!username || username.trim() === "") {
    errors.push("ユーザー名を入力してください");
    return { isValid: false, errors };
  }

  // 長さチェック
  if (username.length < 3) {
    errors.push("ユーザー名は3文字以上必要です");
  }
  if (username.length > 30) {
    errors.push("ユーザー名は30文字以内にしてください");
  }

  // 使用可能文字チェック（英数字、アンダースコア、ハイフン）
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    errors.push("ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます");
  }

  // 先頭と末尾のチェック
  if (username.startsWith("-") || username.startsWith("_")) {
    errors.push("ユーザー名は英数字で始める必要があります");
  }
  if (username.endsWith("-") || username.endsWith("_")) {
    errors.push("ユーザー名は英数字で終わる必要があります");
  }

  // 禁止ワードチェック
  const forbiddenWords = ["admin", "root", "system", "null", "undefined"];
  const lowerUsername = username.toLowerCase();
  if (forbiddenWords.includes(lowerUsername)) {
    errors.push("このユーザー名は使用できません");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * URLをバリデーション
 * @param url - チェックするURL
 * @returns 有効ならtrue
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * URLを詳細にバリデーション
 * @param url - チェックするURL
 * @param options - バリデーションオプション
 * @returns バリデーション結果
 */
export function validateUrl(
  url: string,
  options: {
    requireHttps?: boolean;
    allowedDomains?: string[];
  } = {},
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { requireHttps = false, allowedDomains = [] } = options;

  if (!url || url.trim() === "") {
    errors.push("URLを入力してください");
    return { isValid: false, errors };
  }

  if (!isValidUrl(url)) {
    errors.push("有効なURLを入力してください");
    return { isValid: false, errors };
  }

  const urlObj = new URL(url);

  // HTTPSチェック
  if (requireHttps && urlObj.protocol !== "https:") {
    errors.push("HTTPSのURLを使用してください");
  }

  // ドメイン制限チェック
  if (allowedDomains.length > 0) {
    const isAllowed = allowedDomains.some(
      (domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
    );
    if (!isAllowed) {
      errors.push(
        `許可されたドメインのみ使用できます: ${allowedDomains.join(", ")}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 名前をバリデーション
 * @param name - チェックする名前
 * @returns バリデーション結果
 */
export function validateName(name: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!name || name.trim() === "") {
    errors.push("名前を入力してください");
    return { isValid: false, errors };
  }

  if (name.length < 1) {
    errors.push("名前を入力してください");
  }

  if (name.length > 100) {
    errors.push("名前は100文字以内にしてください");
  }

  // 数字のみはNG
  if (/^\d+$/.test(name)) {
    errors.push("名前に文字を含めてください");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 電話番号をバリデーション（日本の電話番号）
 * @param phoneNumber - チェックする電話番号
 * @returns 有効ならtrue
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // ハイフンあり・なし両方対応
  const phoneRegex = /^0\d{9,10}$|^0\d{1,4}-\d{1,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * 入力をサニタイズ（XSS対策）
 * @param input - サニタイズする文字列
 * @returns サニタイズされた文字列
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * HTMLタグを除去
 * @param input - HTMLを含む文字列
 * @returns HTMLタグを除去した文字列
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * 文字列を切り詰める
 * @param str - 切り詰める文字列
 * @param maxLength - 最大長
 * @param suffix - 省略記号（デフォルト: '...'）
 * @returns 切り詰められた文字列
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix: string = "...",
): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * スラッグを生成（URL用）
 * @param text - 元のテキスト
 * @returns スラッグ
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 特殊文字を除去
    .replace(/[\s_-]+/g, "-") // スペース、アンダースコアをハイフンに
    .replace(/^-+|-+$/g, ""); // 先頭と末尾のハイフンを除去
}

/**
 * 文字列が空または空白のみかチェック
 * @param str - チェックする文字列
 * @returns 空または空白のみならtrue
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim() === "";
}
