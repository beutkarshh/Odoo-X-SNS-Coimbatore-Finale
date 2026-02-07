const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all discounts
 */
async function getAllDiscounts() {
  return prisma.discount.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get active discounts
 */
async function getActiveDiscounts() {
  const now = new Date();
  return prisma.discount.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      OR: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get discount by ID
 */
async function getDiscountById(id) {
  const discount = await prisma.discount.findUnique({
    where: { id: parseInt(id) },
  });

  if (!discount) {
    const err = new Error('Discount not found');
    err.statusCode = 404;
    throw err;
  }

  return discount;
}

/**
 * Create new discount
 */
async function createDiscount(data) {
  return prisma.discount.create({
    data: {
      name: data.name,
      type: data.type || 'PERCENTAGE',
      value: parseFloat(data.value),
      minPurchase: data.minPurchase ? parseFloat(data.minPurchase) : null,
      minQuantity: data.minQuantity || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      usageLimit: data.usageLimit || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

/**
 * Update discount
 */
async function updateDiscount(id, data) {
  const discount = await prisma.discount.findUnique({
    where: { id: parseInt(id) },
  });

  if (!discount) {
    const err = new Error('Discount not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.discount.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.type && { type: data.type }),
      ...(data.value !== undefined && { value: parseFloat(data.value) }),
      ...(data.minPurchase !== undefined && { minPurchase: data.minPurchase ? parseFloat(data.minPurchase) : null }),
      ...(data.minQuantity !== undefined && { minQuantity: data.minQuantity }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

/**
 * Delete discount
 */
async function deleteDiscount(id) {
  const discount = await prisma.discount.findUnique({
    where: { id: parseInt(id) },
  });

  if (!discount) {
    const err = new Error('Discount not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.discount.delete({
    where: { id: parseInt(id) },
  });
}

/**
 * Increment discount usage count
 */
async function incrementUsage(id) {
  return prisma.discount.update({
    where: { id: parseInt(id) },
    data: {
      usedCount: { increment: 1 },
    },
  });
}

module.exports = {
  getAllDiscounts,
  getActiveDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  incrementUsage,
};
