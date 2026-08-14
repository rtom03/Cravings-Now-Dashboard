-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_localized" TEXT,
    "image" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);
