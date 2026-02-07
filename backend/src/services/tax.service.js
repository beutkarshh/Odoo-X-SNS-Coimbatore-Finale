const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all taxes
 */
async function getAllTaxes() {
  return prisma.tax.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get tax by ID
 */
async function getTaxById(id) {
  const tax = await prisma.tax.findUnique({
    where: { id: parseInt(id) },
  });

  if (!tax) {
    const err = new Error('Tax not found');
    err.statusCode = 404;
    throw err;
  }

  return tax;
}

/**
 * Create new tax
 */
async function createTax(data) {
  return prisma.tax.create({
    data: {
      name: data.name,
      type: data.type || 'SALES',
      percentage: parseFloat(data.percentage),
      description: data.description || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

/**
 * Update tax
 */
async function updateTax(id, data) {
  const tax = await prisma.tax.findUnique({
    where: { id: parseInt(id) },
  });

  if (!tax) {
    const err = new Error('Tax not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.tax.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.type && { type: data.type }),
      ...(data.percentage !== undefined && { percentage: parseFloat(data.percentage) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

/**
 * Delete tax
 */
async function deleteTax(id) {
  const tax = await prisma.tax.findUnique({
    where: { id: parseInt(id) },
  });

  if (!tax) {
    const err = new Error('Tax not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.tax.delete({
    where: { id: parseInt(id) },
  });
}

module.exports = {
  getAllTaxes,
  getTaxById,
  createTax,
  updateTax,
  deleteTax,
};
