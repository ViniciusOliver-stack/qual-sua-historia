/*
  Warnings:

  - You are about to drop the `book_contents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `coverImage` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `totalPages` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `wordCount` on the `books` table. All the data in the column will be lost.
  - Added the required column `content` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "book_contents_bookId_key";

-- DropIndex
DROP INDEX "book_pages_bookId_pageNumber_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "book_contents";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "book_pages";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_books" ("createdAt", "id", "style", "title", "updatedAt", "userId") SELECT "createdAt", "id", "style", "title", "updatedAt", "userId" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
