const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/product-variants?productId=<id>
 * Get all product variants (optionally filtered by product)
 */
async function getAllVariants(productId = null) {
  const where = productId ? { productId } : {};
  
  const variants = await prisma.productVariant.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return variants;
}

/**
 * GET /api/product-variants/:id
 * Get a single product variant by ID
 */
async function getVariantById(id) {
  const variant = await prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
        },
      },
    },
  });

  if (!variant) {
    const error = new Error('Product variant not found');
    error.status = 404;
    throw error;
  }

  return variant;
}

/**
 * POST /api/product-variants
 * Create a new product variant
 */
async function createVariant(data) {
  const { productId, attribute, value, extraPrice } = data;

  if (!productId || !attribute || !value) {
    const error = new Error('productId, attribute, and value are required');
    error.status = 400;
    throw error;
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  // Check for duplicate variant
  const existing = await prisma.productVariant.findFirst({
    where: {
      productId,
      attribute,
      value,
    },
  });

  if (existing) {
    const error = new Error('A variant with this attribute and value already exists for this product');
    error.status = 409;
    throw error;
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId,
      attribute,
      value,
      extraPrice: extraPrice || 0,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
  });

  return variant;
}

/**
 * PUT /api/product-variants/:id
 * Update an existing product variant
 */
async function updateVariant(id, data) {
  const { attribute, value, extraPrice } = data;

  const existing = await prisma.productVariant.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error('Product variant not found');
    error.status = 404;
    throw error;
  }

  // Check for duplicate if attribute/value changed
  if (attribute || value) {
    const duplicate = await prisma.productVariant.findFirst({
      where: {
        productId: existing.productId,
        attribute: attribute || existing.attribute,
        value: value || existing.value,
        NOT: { id },
      },
    });

    if (duplicate) {
      const error = new Error('A variant with this attribute and value already exists for this product');
      error.status = 409;
      throw error;
    }
  }

  const updateData = {};
  if (attribute !== undefined) updateData.attribute = attribute;
  if (value !== undefined) updateData.value = value;
  if (extraPrice !== undefined) updateData.extraPrice = extraPrice;

  const variant = await prisma.productVariant.update({
    where: { id },
    data: updateData,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
  });

  return variant;
}

/**
 * DELETE /api/product-variants/:id
 * Delete a product variant
 */
async function deleteVariant(id) {
  const existing = await prisma.productVariant.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error('Product variant not found');
    error.status = 404;
    throw error;
  }

  await prisma.productVariant.delete({
    where: { id },
  });

  return { message: 'Product variant deleted successfully' };
}

module.exports = {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
};
