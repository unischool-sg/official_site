import { prisma } from "../prisma";
import { Prisma, User as PrismaUser } from "@prisma/client";
import { verifyPassword } from "@/utils/hash";

class User {
  private readonly userId: string;
  private readonly data: PrismaUser;
  private constructor(data: PrismaUser) {
    this.userId = data.id;
    this.data = data;
  }

  static async get(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? new User(user) : null;
  }

  static async new(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });
    return new User(user);
  }

  static async login(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isValidPassword = await verifyPassword(password, user.password);
    return isValidPassword ? new User(user) : null;
  }
}
