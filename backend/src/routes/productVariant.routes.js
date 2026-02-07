const express = require('express');
const variantController = require('../controllers/productVariant.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

// All product variant routes require authentication and ADMIN role
const adminOnly = [authenticateToken, authorizeRoles('ADMIN')];

/**
 * GET /api/product-variants?productId=<id>
 */
router.get('/', ...adminOnly, variantController.getAllVariants);

/**
 * GET /api/product-variants/:id
 */
router.get('/:id', ...adminOnly, variantController.getVariantById);

/**
 * POST /api/product-variants
 */
router.post('/', ...adminOnly, variantController.createVariant);

/**
 * PUT /api/product-variants/:id
 */
router.put('/:id', ...adminOnly, variantController.updateVariant);

/**
 * DELETE /api/product-variants/:id
 */
router.delete('/:id', ...adminOnly, variantController.deleteVariant);

module.exports = router;
