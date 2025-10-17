export const loginEmailTemplate = (loginTime: string, ipAddress: string, deviceInfo: string, location: string) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uni School - ログイン通知</title>
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
                                We are team of <span style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600;">Creators</span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- メインコンテンツ -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.3;">
                                新しいログインが検出されました
                            </h2>
                            
                            <p style="margin: 0 0 30px; color: #525252; font-size: 16px; line-height: 1.6;">
                                あなたのアカウントに新しいログインがありました。<br>
                                以下の情報をご確認ください。
                            </p>
                            
                            <!-- ログイン情報 -->
                            <div style="background-color: #f5f5f5; border-radius: 10px; padding: 24px; margin-bottom: 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 120px; vertical-align: top;">
                                                        <strong style="color: #525252; font-size: 14px;">📅 日時</strong>
                                                    </td>
                                                    <td style="color: #1a1a1a; font-size: 14px;">
                                                        ${loginTime}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 120px; vertical-align: top;">
                                                        <strong style="color: #525252; font-size: 14px;">🌐 IPアドレス</strong>
                                                    </td>
                                                    <td>
                                                        <code style="background-color: #e5e5e5; padding: 4px 8px; border-radius: 4px; font-size: 13px; color: #1a1a1a;">
                                                            ${ipAddress}
                                                        </code>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 120px; vertical-align: top;">
                                                        <strong style="color: #525252; font-size: 14px;">💻 デバイス</strong>
                                                    </td>
                                                    <td style="color: #1a1a1a; font-size: 14px;">
                                                        ${deviceInfo}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 120px; vertical-align: top;">
                                                        <strong style="color: #525252; font-size: 14px;">🌍 場所</strong>
                                                    </td>
                                                    <td style="color: #1a1a1a; font-size: 14px;">
                                                        ${location}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- 区切り線 -->
                            <div style="border-top: 1px solid #e5e5e5; margin: 30px 0;"></div>
                            
                            <!-- 本人確認 -->
                            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.5;">
                                    <strong>✅ このログインに心当たりがある場合</strong><br>
                                    特に何もする必要はありません。このメールは情報提供のみです。
                                </p>
                            </div>
                            
                            <!-- セキュリティ警告 -->
                            <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0 0 10px; color: #991b1b; font-size: 14px; line-height: 1.5;">
                                    <strong>⚠️ このログインに心当たりがない場合</strong><br>
                                    すぐに以下の対応を行ってください：
                                </p>
                                <ol style="margin: 0; padding-left: 20px; color: #991b1b; font-size: 14px; line-height: 1.5;">
                                    <li style="margin-bottom: 8px;">パスワードを変更する</li>
                                    <li style="margin-bottom: 8px;">他のデバイスからログアウトする</li>
                                    <li>管理者に連絡する</li>
                                </ol>
                            </div>
                            
                            <!-- ボタン -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/history" style="display: inline-block; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 10px; font-size: 16px; font-weight: 600; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); margin-right: 10px;">
                                            ログイン履歴を確認
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0; color: #737373; font-size: 14px; line-height: 1.6; text-align: center;">
                                このメールは自動送信されています。<br>
                                アカウントのセキュリティを保つため、定期的にパスワードを変更することをお勧めします。
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