-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('FOLDER', 'FILE');

-- CreateTable
CREATE TABLE "public"."Node" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."NodeType" NOT NULL DEFAULT 'FOLDER',
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Node" ADD CONSTRAINT "Node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;
