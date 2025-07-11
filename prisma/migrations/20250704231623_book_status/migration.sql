/*
  Warnings:

  - You are about to drop the `book_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `content` on the `book_pages` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `books` table. All the data in the column will be lost.
  - Added the required column `htmlContent` to the `book_pages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `book_pages` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "book_images";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "book_contents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    CONSTRAINT "book_contents_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_book_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "book_pages_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_book_pages" ("bookId", "id", "pageNumber") SELECT "bookId", "id", "pageNumber" FROM "book_pages";
DROP TABLE "book_pages";
ALTER TABLE "new_book_pages" RENAME TO "book_pages";
CREATE UNIQUE INDEX "book_pages_bookId_pageNumber_key" ON "book_pages"("bookId", "pageNumber");
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "genre" TEXT,
    "style" TEXT NOT NULL DEFAULT 'classic',
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
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

-- CreateIndex
CREATE UNIQUE INDEX "book_contents_bookId_key" ON "book_contents"("bookId");
