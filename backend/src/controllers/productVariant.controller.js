const variantService = require('../services/productVariant.service');

/**
 * GET /api/product-variants
 */
async function getAllVariants(req, res, next) {
  try {
    const { productId } = req.query;
    const variants = await variantService.getAllVariants(productId);
    return res.status(200).json({ success: true, data: variants });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/product-variants/:id
 */
async function getVariantById(req, res, next) {
  try {
    const variant = await variantService.getVariantById(req.params.id);
    return res.status(200).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/product-variants
 */
async function createVariant(req, res, next) {
  try {
    const variant = await variantService.createVariant(req.body);
    return res.status(201).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/product-variants/:id
 */
async function updateVariant(req, res, next) {
  try {
    const variant = await variantService.updateVariant(req.params.id, req.body);
    return res.status(200).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/product-variants/:id
 */
async function deleteVariant(req, res, next) {
  try {
    await variantService.deleteVariant(req.params.id);
    return res.status(200).json({ success: true, message: 'Product variant deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
};
