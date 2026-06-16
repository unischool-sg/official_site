export default function Privacy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-neutral-800">
            <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
            <p className="text-sm text-neutral-500 mb-8">
                最終更新日: 2026年6月16日
            </p>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">1. はじめに</h2>
                <p className="leading-relaxed mb-4">
                    UniSchool（以下「当チーム」）は、当チームが提供するウェブサイト、及び開発するソフトウェア（以下「本サービス」）における
                    ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
                </p>
                <p className="leading-relaxed">
                    本ポリシーは、当チームが本サービスを通じて取得する個人情報の取扱いについて、Google Cloud の OAuth API スコープ審査に
                    対応した内容を含み、日本の「個人情報の保護に関する法律」に準拠して策定しています。
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">2. 取得する情報と利用目的</h2>

                <h3 className="text-lg font-medium mt-6 mb-3">2.1 Google アカウントによる認証情報</h3>
                <p className="leading-relaxed mb-4">
                    本サービスの一部機能では、Google Login（OAuth 2.0）を使用した認証を提供しています。
                    ユーザーが Google アカウントでログインする際に、以下の情報を取得します。
                </p>
                <ul className="list-disc pl-6 leading-relaxed mb-4 space-y-2">
                    <li>Google アカウントのメールアドレス</li>
                    <li>Google アカウントのプロフィール情報（氏名、アバター画像）</li>
                    <li>Google アカウントの一意の識別子（sub）</li>
                </ul>
                <p className="leading-relaxed mb-4">
                    一部の機能では、ユーザーの明示的な同意に基づき、Google Cloud の審査が必要な
                    スコープ（例: 特定の Google サービスへのアクセス権限）を要求する場合があります。
                    これらのスコープは、各機能の提供に必要最小限の範囲に限定して利用し、
                    ユーザーの同意なく追加のスコープを要求することはありません。
                </p>
                <p className="leading-relaxed">
                    <strong>利用目的:</strong> ユーザー認証、アカウント管理、本人確認、及び本サービスの
                    機能提供のため。
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">2.2 アクセス解析情報</h3>
                <p className="leading-relaxed mb-4">
                    当チームのウェブサイトでは、Google Analytics を利用してアクセス解析を行っています。
                    Google Analytics は、クッキー（Cookie）を使用して以下の情報を収集します。
                </p>
                <ul className="list-disc pl-6 leading-relaxed mb-4 space-y-2">
                    <li>ページの閲覧履歴（URL、参照元）</li>
                    <li>ブラウザの種類とバージョン</li>
                    <li>オペレーティングシステム</li>
                    <li>おおよその地理的位置（IPアドレスから特定できない範囲）</li>
                    <li>デバイス情報</li>
                </ul>
                <p className="leading-relaxed">
                    <strong>利用目的:</strong> ウェブサイトの利用状況分析、品質向上、及びコンテンツ改善のため。
                    Google Analytics で収集されたデータは、Google 社のプライバシーポリシーに従って管理されます。
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">3. データの保存と保護</h2>

                <div className="space-y-4 leading-relaxed">
                    <p>
                        <strong>アクセス制限:</strong> 当チームが取得した個人データは、限られた管理陣のみが
                        アクセスできる厳格な環境で管理されます。管理権限を持つ者の一覧は定期的に見直され、
                        不要になった権限は速やかに剥奪されます。
                    </p>
                    <p>
                        <strong>パスワードの保護:</strong> 本サービスで使用するパスワードは、最新の暗号化アルゴリズム
                        （bcrypt 等のハッシュ関数）を用いて厳重に暗号化（ハッシュ化）された状態で保存されます。
                        パスワードそのものを平文で保存することはなく、いかなる状況においても復元できない形で管理します。
                    </p>
                    <p>
                        <strong>データの仮名化・匿名化:</strong> 保存するデータは、個人を特定できないよう
                        加工（仮名化または匿名化処理）することでプライバシーを保護しています。
                        分析や統計処理に用いるデータについては、個人の識別子を削除または難読化した上で
                        取り扱います。
                    </p>
                    <p>
                        <strong>保存期間:</strong> 個人データは、利用目的の達成に必要な期間のみ保存し、
                        不要となったデータは適切な方法で消去または匿名化します。
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">4. 第三者提供</h2>
                <p className="leading-relaxed mb-4">
                    当チームは、以下の場合を除き、個人情報を第三者に提供することはありません。
                </p>
                <ul className="list-disc pl-6 leading-relaxed space-y-2">
                    <li>ユーザーの明示的な同意を得た場合</li>
                    <li>法令に基づく開示請求があった場合</li>
                    <li>人の生命、身体又は財産の保護のために必要がある場合</li>
                    <li>Google Analytics 等、利用目的の達成に必要な範囲で外部サービスを利用する場合</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">5. ユーザーの権利</h2>
                <p className="leading-relaxed mb-4">
                    ユーザーは、以下の権利を有します。
                </p>
                <ul className="list-disc pl-6 leading-relaxed space-y-2">
                    <li>自身の個人データへのアクセスを請求する権利</li>
                    <li>不正確な個人データの訂正を請求する権利</li>
                    <li>個人データの削除を請求する権利</li>
                    <li>個人データの処理制限を請求する権利</li>
                    <li>Google アカウントを使用した認証の連携を解除する権利</li>
                </ul>
                <p className="leading-relaxed mt-4">
                    上記の権利を行使される場合は、下記のお問い合わせ先までご連絡ください。
                    ご本人確認の上、合理的な期間内に対応いたします。
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">6. Google OAuth API スコープの使用について</h2>
                <p className="leading-relaxed mb-4">
                    本サービスが Google OAuth 2.0 を介して取得する各スコープは、以下の限定された目的にのみ使用されます。
                </p>
                <ul className="list-disc pl-6 leading-relaxed space-y-2">
                    <li>取得した情報は、明示された目的以外に使用しません。</li>
                    <li>ユーザーデータを広告目的に使用することはありません。</li>
                    <li>ユーザーデータを第三者に販売することはありません。</li>
                    <li>ユーザーがアカウントを削除した場合、関連するデータは速やかに削除されます。</li>
                    <li>Google API から取得した情報の使用は、
                        <a href="https://developers.google.com/terms/api-services-user-data-policy"
                           target="_blank" rel="noopener noreferrer"
                           className="underline text-blue-600 hover:text-blue-800">
                            Google API Services User Data Policy
                        </a> を含む、Google の利用制限に準拠します。
                    </li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">7. クッキー（Cookie）について</h2>
                <p className="leading-relaxed">
                    当チームのウェブサイトでは、Google Analytics によるアクセス解析及び
                    認証状態の維持のためにクッキーを使用することがあります。
                    ユーザーはブラウザの設定によりクッキーの受け入れを拒否することができますが、
                    その場合一部の機能がご利用いただけなくなる可能性があります。
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">8. お問い合わせ</h2>
                <p className="leading-relaxed">
                    本ポリシーに関するお問い合わせや、個人情報の取扱いに関するご質問は、
                    以下の窓口までご連絡ください。
                </p>
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="font-medium">UniSchool プライバシー窓口</p>
                    <p>メール: unischool@sandagakuen.ed.jp</p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">9. 改定</h2>
                <p className="leading-relaxed">
                    当チームは、必要に応じて本ポリシーを変更することがあります。
                    重要な変更がある場合は、ウェブサイト上で分かりやすい方法で通知します。
                </p>
            </section>
        </div>
    );
}
