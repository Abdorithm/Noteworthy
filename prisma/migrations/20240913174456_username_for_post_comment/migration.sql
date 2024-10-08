/*
  Warnings:

  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `ownerHandle` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerHandle` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_ownerId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userId",
ADD COLUMN     "ownerHandle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "ownerId",
ADD COLUMN     "ownerHandle" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_ownerHandle_fkey" FOREIGN KEY ("ownerHandle") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ownerHandle_fkey" FOREIGN KEY ("ownerHandle") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
