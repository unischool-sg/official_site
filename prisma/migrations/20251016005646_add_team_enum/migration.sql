-- CreateEnum
CREATE TYPE "UserTeam" AS ENUM ('ALL', 'VIDEO', 'EDIT', 'DEVELOP');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "team" "UserTeam" NOT NULL DEFAULT 'ALL';
