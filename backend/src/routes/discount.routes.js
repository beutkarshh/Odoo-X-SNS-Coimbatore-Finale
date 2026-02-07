const express = require('express');
const discountController = require('../controllers/discount.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

// All discount routes require authentication and ADMIN role
const adminOnly = [authenticateToken, authorizeRoles('ADMIN')];

/**
 * GET /api/discounts
 */
router.get('/', ...adminOnly, discountController.getAllDiscounts);

/**
 * GET /api/discounts/active
 */
router.get('/active', ...adminOnly, discountController.getActiveDiscounts);

/**
 * GET /api/discounts/:id
 */
router.get('/:id', ...adminOnly, discountController.getDiscountById);

/**
 * POST /api/discounts
 */
router.post('/', ...adminOnly, discountController.createDiscount);

/**
 * PUT /api/discounts/:id
 */
router.put('/:id', ...adminOnly, discountController.updateDiscount);

/**
 * DELETE /api/discounts/:id
 */
router.delete('/:id', ...adminOnly, discountController.deleteDiscount);

module.exports = router;
