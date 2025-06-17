CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL
);

CREATE TABLE "Chat" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "_ChatParticipants" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  CONSTRAINT "_ChatParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE,
  CONSTRAINT "_ChatParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "_ChatParticipants_AB_unique" UNIQUE ("A", "B")
);

CREATE TABLE "Message" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "chatId" UUID NOT NULL,
  "senderId" UUID NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE,
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "SeenChat" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "chatId" UUID NOT NULL,
  "seenAt" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "SeenChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "SeenChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE,
  CONSTRAINT "SeenChat_user_chat_unique" UNIQUE ("userId", "chatId")
);
