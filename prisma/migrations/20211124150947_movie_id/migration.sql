/*
  Warnings:

  - Added the required column `apiId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "movie_id_seq";
ALTER TABLE "Movie" ADD COLUMN     "apiId" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('movie_id_seq');
ALTER SEQUENCE "movie_id_seq" OWNED BY "Movie"."id";
