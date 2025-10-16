import bcrypt from "bcryptjs";

/**
 * パスワードをハッシュ化
 * @param password - 平文パスワード
 * @param saltRounds - ソルトのラウンド数（デフォルト: 10）
 * @returns ハッシュ化されたパスワード
 */
export async function hashPassword(
     password: string,
     saltRounds: number = 10,
): Promise<string> {
     try {
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);
          return hashedPassword;
     } catch (error) {
          throw new Error(`パスワードのハッシュ化に失敗しました: ${error}`);
     }
}

/**
 * パスワードを検証
 * @param password - 平文パスワード
 * @param hashedPassword - ハッシュ化されたパスワード
 * @returns 一致すればtrue、不一致ならfalse
 */
export async function verifyPassword(
     password: string,
     hashedPassword: string,
): Promise<boolean> {
     try {
          const isMatch = await bcrypt.compare(password, hashedPassword);
          return isMatch;
     } catch (error) {
          throw new Error(`パスワードの検証に失敗しました: ${error}`);
     }
}

/**
 * パスワードの強度をチェック
 * @param password - チェックするパスワード
 * @returns 強度の評価結果
 */
export function checkPasswordStrength(password: string): {
     isValid: boolean;
     strength: "weak" | "medium" | "strong" | "very-strong";
     feedback: string[];
} {
     const feedback: string[] = [];
     let score = 0;

     // 最小長チェック
     if (password.length < 8) {
          feedback.push("パスワードは8文字以上にしてください");
          return { isValid: false, strength: "weak", feedback };
     }

     // 長さによるスコア
     if (password.length >= 8) score++;
     if (password.length >= 12) score++;
     if (password.length >= 16) score++;

     // 文字種類のチェック
     const hasLowerCase = /[a-z]/.test(password);
     const hasUpperCase = /[A-Z]/.test(password);
     const hasNumbers = /\d/.test(password);
     const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
          password,
     );

     if (hasLowerCase) score++;
     else feedback.push("小文字を含めてください");

     if (hasUpperCase) score++;
     else feedback.push("大文字を含めてください");

     if (hasNumbers) score++;
     else feedback.push("数字を含めてください");

     if (hasSpecialChars) score++;
     else feedback.push("特殊文字を含めてください");

     // よくあるパターンのチェック
     const commonPatterns = [
          "password",
          "12345",
          "qwerty",
          "abc123",
          "password123",
     ];
     const lowerPassword = password.toLowerCase();
     const hasCommonPattern = commonPatterns.some((pattern) =>
          lowerPassword.includes(pattern),
     );

     if (hasCommonPattern) {
          feedback.push("よく使われるパスワードパターンは避けてください");
          score = Math.max(0, score - 2);
     }

     // 強度の判定
     let strength: "weak" | "medium" | "strong" | "very-strong";
     if (score <= 3) strength = "weak";
     else if (score <= 5) strength = "medium";
     else if (score <= 6) strength = "strong";
     else strength = "very-strong";

     const isValid = score >= 4; // 最低でもmedium以上

     if (feedback.length === 0) {
          feedback.push("強力なパスワードです！");
     }

     return { isValid, strength, feedback };
}

/**
 * パスワードをバリデーション
 * @param password - チェックするパスワード
 * @returns バリデーション結果
 */
export function validatePassword(password: string): {
     isValid: boolean;
     errors: string[];
} {
     const errors: string[] = [];

     // 長さチェック
     if (password.length < 8) {
          errors.push("パスワードは8文字以上必要です");
     }

     if (password.length > 72) {
          errors.push("パスワードは72文字以下にしてください（bcryptの制限）");
     }

     // 最低限の複雑性チェック
     const hasLetter = /[a-zA-Z]/.test(password);
     const hasNumber = /\d/.test(password);

     if (!hasLetter) {
          errors.push("パスワードには文字を含める必要があります");
     }

     if (!hasNumber) {
          errors.push("パスワードには数字を含める必要があります");
     }

     return {
          isValid: errors.length === 0,
          errors,
     };
}

/**
 * ランダムなパスワードを生成
 * @param length - パスワードの長さ（デフォルト: 16）
 * @param options - 生成オプション
 * @returns 生成されたパスワード
 */
export function generateRandomPassword(
     length: number = 16,
     options: {
          includeLowerCase?: boolean;
          includeUpperCase?: boolean;
          includeNumbers?: boolean;
          includeSpecialChars?: boolean;
     } = {},
): string {
     const {
          includeLowerCase = true,
          includeUpperCase = true,
          includeNumbers = true,
          includeSpecialChars = true,
     } = options;

     let charset = "";
     if (includeLowerCase) charset += "abcdefghijklmnopqrstuvwxyz";
     if (includeUpperCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     if (includeNumbers) charset += "0123456789";
     if (includeSpecialChars) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

     if (charset === "") {
          throw new Error("少なくとも1つの文字種類を含める必要があります");
     }

     let password = "";
     const randomValues = new Uint32Array(length);
     crypto.getRandomValues(randomValues);

     for (let i = 0; i < length; i++) {
          password += charset[randomValues[i] % charset.length];
     }

     return password;
}

/**
 * パスワードが以前使用されたものかチェック
 * @param newPassword - 新しいパスワード
 * @param oldPasswordHashes - 過去のパスワードハッシュのリスト
 * @returns 使用済みならtrue
 */
export async function isPasswordReused(
     newPassword: string,
     oldPasswordHashes: string[],
): Promise<boolean> {
     for (const oldHash of oldPasswordHashes) {
          const isMatch = await verifyPassword(newPassword, oldHash);
          if (isMatch) {
               return true;
          }
     }
     return false;
}
