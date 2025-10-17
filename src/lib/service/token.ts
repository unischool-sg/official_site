import { VerificationToken, TokenType } from "@prisma/client";
import { generateSecureToken } from "@/utils/token";
import { prisma } from "../prisma";
import { User } from "./user";

class Token {
     readonly token: string;
     private readonly data: VerificationToken;
     private constructor(data: VerificationToken) {
          this.token = data.token;
          this.data = data;
     }

     static async get(token: string): Promise<Token | null> {
          const record = await prisma.verificationToken.findUnique({
               where: { token },
          });
          return record ? new Token(record) : null;
     }

     static async new(
          userId: string,
          type: TokenType,
          hoursValid: number = 24,
     ): Promise<Token> {
          const token = generateSecureToken(32);
          const expires = new Date(Date.now() + hoursValid * 60 * 60 * 1000);
          const record = await prisma.verificationToken.create({
               data: { token, userId, type, expires },
          });
          return new Token(record);
     }

     get type(): TokenType {
          return this.data.type;
     }
     get expires(): Date {
          return this.data.expires;
     }
     get user(): Promise<User | null> {
          return User.get({ id: this.data.userId });
     }

     async delete(): Promise<void> {
          await prisma.verificationToken.delete({
               where: { token: this.token },
          });
     }
     async extendExpiration(hours: number): Promise<void> {
          const newExpires = new Date(Date.now() + hours * 60 * 60 * 1000);
          this.data.expires = newExpires;
          await prisma.verificationToken.update({
               where: { token: this.token },
               data: { expires: newExpires },
          });
     }
     isExpired(): boolean {
          return new Date() > this.data.expires;
     }
     isActive(type: TokenType): boolean {
          return (
               this.data.type === type && !this.isExpired()
          );
     }
     async userVerified(): Promise<boolean> {
          const user = await this.user;
          return user ? !!user.emailVerified : false;
     }
     async verifyUserEmail(): Promise<void> {
          const user = await this.user;
          if (user) {
               await user.verifyEmail();
          }
     }
}

export { Token };
