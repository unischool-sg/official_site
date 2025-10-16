export const verifyEmailTemplate = (verifyLink: string) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uni School - アカウント登録確認</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- メインコンテナ -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden; max-width: 100%;">
                    
                    <!-- ヘッダー グラデーション -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0 0 10px; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
                                Uni School
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 400;">
                                We are team of <span style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 600;">Creators</span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- メインコンテンツ -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.3;">
                                アカウント登録を完了してください
                            </h2>
                            
                            <p style="margin: 0 0 30px; color: #525252; font-size: 16px; line-height: 1.6;">
                                Uni School クリエイターチームへようこそ！<br>
                                以下のボタンをクリックして、メールアドレスの確認を行ってください。
                            </p>
                            
                            <!-- ボタン -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${verifyLink}" style="display: inline-block; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 10px; font-size: 16px; font-weight: 600; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                                            メールアドレスを確認する
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- 区切り線 -->
                            <div style="border-top: 1px solid #e5e5e5; margin: 30px 0;"></div>
                            
                            <!-- 補足情報 -->
                            <p style="margin: 0 0 15px; color: #737373; font-size: 14px; line-height: 1.6;">
                                ボタンがクリックできない場合は、以下のリンクをコピーしてブラウザに貼り付けてください：
                            </p>
                            <p style="margin: 0 0 30px; color: #10b981; font-size: 13px; word-break: break-all; background-color: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 3px solid #10b981;">
                                ${verifyLink}
                            </p>
                            
                            <!-- 警告 -->
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    <strong>⏱️ 重要：</strong> このリンクは15日間有効です。期限が切れた場合は、再度登録手続きを行ってください。
                                </p>
                            </div>
                            
                            <p style="margin: 0; color: #737373; font-size: 14px; line-height: 1.6;">
                                このメールに心当たりがない場合は、無視していただいて構いません。
                            </p>
                        </td>
                    </tr>
                    
                    <!-- フッター -->
                    <tr>
                        <td style="background-color: #fafafa; padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0 0 10px; color: #525252; font-size: 16px; font-weight: 600; text-align: center;">
                                Uni School
                            </p>
                            <p style="margin: 0 0 15px; color: #737373; font-size: 13px; text-align: center; line-height: 1.5;">
                                We are students. But we are pro.
                            </p>
                            <p style="margin: 0; color: #a3a3a3; font-size: 12px; text-align: center;">
                                © 2025 Uni School. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;