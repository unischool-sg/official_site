import { verifyPassword, hashPassword } from "@/utils/hash";
import { Prisma, User as PrismaUser, Profile } from "@prisma/client";
import { generateSecureToken } from "@/utils/token";
import { cookies } from "next/headers";
import { prisma } from "../prisma";
import { send } from "../resend";

type UserWithProfile = PrismaUser & {
    profile?: Profile | null;
};

class User {
    private readonly userId: string;
    private readonly data: UserWithProfile;
    private constructor(data: UserWithProfile) {
        this.userId = data.id;
        this.data = data;
    }

    // Getter methods for accessing user data
    get id(): string {
        return this.data.id;
    }

    get email(): string {
        return this.data.email;
    }

    get name(): string {
        return this.data.name;
    }

    get role(): PrismaUser["role"] {
        return this.data.role;
    }

    get emailVerified(): Date | null {
        return this.data.emailVerified;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    get deletedAt(): Date | null {
        return this.data.deletedAt;
    }

    get team(): PrismaUser["team"] {
        return this.data.team;
    }

    get profile(): Profile | null | undefined {
        return this.data.profile;
    }

    // Public method to get all data (without password)
    toJSON(): Omit<PrismaUser, "password"> {
        const { password, ...userWithoutPassword } = this.data;
        return userWithoutPassword;
    }

    /**
     * ユーザーのプロフィールを取得
     * @returns プロフィール情報（存在しない場合はnull）
     */
    async getProfile() {
        const profile = await prisma.profile.findUnique({
            where: { userId: this.userId },
        });
        return profile;
    }

    /**
     * ユーザーのプロフィールを作成または更新
     * @param data - プロフィールデータ
     * @returns 作成/更新されたプロフィール
     */
    async upsertProfile(data: { bio?: string; avatarUrl?: string }) {
        return await prisma.profile.upsert({
            where: { userId: this.userId },
            create: {
                userId: this.userId,
                ...data,
            },
            update: data,
        });
    }

    static async get(
        data: Prisma.UserWhereUniqueInput,
        includeProfile: boolean = false
    ): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: data,
            include: {
                profile: includeProfile,
            },
        });
        return user ? new User(user) : null;
    }

    static async new(data: Prisma.UserCreateInput): Promise<User> {
        data.password = await hashPassword(data.password);
        const user = await prisma.user.create({
            data,
        });
        return new User(user);
    }

    static async current(includeProfile: boolean = false): Promise<User | null> {
        const store = await cookies();
        const sessionToken = store.get("s-token")?.value;
        if (!sessionToken) {
            console.log("[User.current] No session token found");
            return null;
        }

        const session = await prisma.session.findUnique({
            where: { sessionToken },
            include: {
                user: {
                    include: {
                        profile: includeProfile,
                    },
                },
            },
        });

        if (!session) {
            console.log("[User.current] Session not found in database");
            return null;
        }

        const now = new Date();
        const isExpired = session.expires < now;
        
        if (isExpired) {
            console.log("[User.current] Session expired:", {
                expires: session.expires,
                now: now,
                diff: (now.getTime() - session.expires.getTime()) / 1000 / 60 + " minutes ago"
            });
            // 期限切れセッションを削除
            await prisma.session.delete({
                where: { sessionToken }
            });
            return null;
        }

        console.log("[User.current] Valid session found:", {
            userId: session.userId,
            expiresIn: (session.expires.getTime() - now.getTime()) / 1000 / 60 + " minutes"
        });

        return new User(session.user);
    }

    static async all(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map((user) => new User(user));
    }

    static async hashPassword(password: string): Promise<string> {
        return await hashPassword(password);
    }

	// 基本機能
	async login(
		password: string,
		options?: {
			rememberMe?: boolean;
			ipAddress?: string;
			userAgent?: string;
		},
	): Promise<string | null> {
		const isMatch = await verifyPassword(password, this.data.password);

		if (isMatch) {
			// セッションの有効期限を設定
			const sessionDuration = options?.rememberMe
				? 90 * 24 * 60 * 60 * 1000 // 90日間
				: 7 * 24 * 60 * 60 * 1000; // 7日間

			// セッショントークンを生成
			const sessionToken = generateSecureToken(32);

			const [session] = await Promise.all([
				// 新しいセッションを作成
				prisma.session.create({
					data: {
						userId: this.userId,
						sessionToken,
						expires: new Date(Date.now() + sessionDuration),
						ipAddress: options?.ipAddress,
						userAgent: options?.userAgent,
					},
				}),
				// 期限切れセッションを削除
				prisma.session.deleteMany({
					where: {
						userId: this.userId,
						expires: {
							lt: new Date(),
						},
					},
				}),
				// ログイン履歴を記録（成功）
				prisma.loginHistory.create({
					data: {
						userId: this.userId,
						success: true,
						ipAddress: options?.ipAddress,
						userAgent: options?.userAgent,
					},
				}),
			]);

			// クッキーにセッショントークンを保存
			const cookieStore = await cookies();
			cookieStore.set("s-token", sessionToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: sessionDuration / 1000, // 秒単位
				path: "/",
			});

			return session.sessionToken;
		}

		// ログイン失敗を記録
		if (options?.ipAddress || options?.userAgent) {
			await prisma.loginHistory.create({
				data: {
					userId: this.userId,
					success: false,
					ipAddress: options?.ipAddress,
					userAgent: options?.userAgent,
				},
			});
		}

		return null;
	}

	async logout(): Promise<void> {
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get("s-token")?.value;

		if (sessionToken) {
			// セッションを削除
			await prisma.session.delete({
				where: { sessionToken },
			});

			// クッキーを削除
			cookieStore.delete("s-token");
		}
	}

	async logoutAll(): Promise<void> {
		// すべてのセッションを削除
		await prisma.session.deleteMany({
			where: { userId: this.userId },
		});

		// クッキーを削除
		const cookieStore = await cookies();
		cookieStore.delete("s-token");
	}
    
    async update(data: Prisma.UserUpdateInput): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { id: this.userId },
            data,
        });
        return new User(updatedUser);
    }

    async delete(): Promise<void> {
        await prisma.user.delete({
            where: { id: this.userId },
        });
    }

    // 認証関連
    async verifyEmail(): Promise<void> {
        await prisma.user.update({
            where: { id: this.userId },
            data: { emailVerified: new Date() },
        });
    }

    async changePassword(newPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id: this.userId },
            data: { password: newPassword },
        });
    }

    async sendPasswordResetEmail(): Promise<void> {
        const token = generateSecureToken(32);
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1時間有効

        try {
            await prisma.verificationToken.create({
                data: {
                    userId: this.userId,
                    token,
                    type: "PASSWORD_RESET",
                    expires,
                },
            });
        } catch (error) {
            throw error;
        }

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

        await send(
            this.data.email, 
            "パスワードリセット",  
            `以下のリンクをクリックしてパスワードをリセットしてください: <a href="${resetLink}">${resetLink}</a>`
        );
    }

    async sendEmailVerification(): Promise<void> {
        const token = generateSecureToken(32);
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1時間有効

        try {
            await prisma.verificationToken.create({
                data: {
                    userId: this.userId,
                    token,
                    type: "REGISTRATION_CONFIRMATION",
                    expires,
                },
            });
        } catch (error) {
            throw error;
        }

        const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`;

        const result = await send(
            this.data.email, 
            "メールアドレスの確認", 
            `以下のリンクからUniSchoolアカウントを作成してください: <a href="${verifyLink}">${verifyLink}</a>`
        );

        console.log("Verification email sent to:", result);
    }
}


export { User };