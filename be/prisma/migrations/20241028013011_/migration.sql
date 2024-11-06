-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "photo" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productDesc" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_userId_key" ON "product"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "product_categoryId_key" ON "product"("categoryId");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
