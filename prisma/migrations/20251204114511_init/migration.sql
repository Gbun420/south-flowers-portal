-- CreateTable
CREATE TABLE "news_sources" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "country" TEXT NOT NULL DEFAULT 'MT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastFetched" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "summary" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "category" TEXT,
    "tags" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "sentiment" REAL,
    "credibility" REAL,
    "isFactChecked" BOOLEAN NOT NULL DEFAULT false,
    "factCheckResult" TEXT,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "articles_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "news_sources" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trends" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keyword" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "timeframe" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "articles" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "preferences" JSONB,
    "readHistory" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_name_key" ON "news_sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_url_key" ON "news_sources"("url");

-- CreateIndex
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");

-- CreateIndex
CREATE UNIQUE INDEX "trends_keyword_timeframe_date_key" ON "trends"("keyword", "timeframe", "date");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
