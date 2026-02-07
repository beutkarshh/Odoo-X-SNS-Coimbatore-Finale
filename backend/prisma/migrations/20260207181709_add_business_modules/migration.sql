-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('SALES', 'PURCHASE', 'BOTH');

-- CreateTable
CREATE TABLE "Tax" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TaxType" NOT NULL DEFAULT 'SALES',
    "percentage" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
    "value" DECIMAL(10,2) NOT NULL,
    "minPurchase" DECIMAL(10,2),
    "minQuantity" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "validityDays" INTEGER NOT NULL DEFAULT 30,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planId" INTEGER,

    CONSTRAINT "QuotationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationTemplateLine" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "templateId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationTemplateLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "extraPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tax_name_idx" ON "Tax"("name");

-- CreateIndex
CREATE INDEX "Discount_name_idx" ON "Discount"("name");

-- CreateIndex
CREATE INDEX "Discount_startDate_endDate_idx" ON "Discount"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "QuotationTemplate_name_idx" ON "QuotationTemplate"("name");

-- CreateIndex
CREATE INDEX "QuotationTemplateLine_templateId_idx" ON "QuotationTemplateLine"("templateId");

-- CreateIndex
CREATE INDEX "QuotationTemplateLine_productId_idx" ON "QuotationTemplateLine"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_attribute_idx" ON "ProductVariant"("attribute");

-- AddForeignKey
ALTER TABLE "QuotationTemplate" ADD CONSTRAINT "QuotationTemplate_planId_fkey" FOREIGN KEY ("planId") REFERENCES "RecurringPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationTemplateLine" ADD CONSTRAINT "QuotationTemplateLine_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "QuotationTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationTemplateLine" ADD CONSTRAINT "QuotationTemplateLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
