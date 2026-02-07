const express = require('express');
const taxController = require('../controllers/tax.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

// All tax routes require authentication and ADMIN role
const adminOnly = [authenticateToken, authorizeRoles('ADMIN')];

/**
 * GET /api/taxes
 */
router.get('/', ...adminOnly, taxController.getAllTaxes);

/**
 * GET /api/taxes/:id
 */
router.get('/:id', ...adminOnly, taxController.getTaxById);

/**
 * POST /api/taxes
 */
router.post('/', ...adminOnly, taxController.createTax);

/**
 * PUT /api/taxes/:id
 */
router.put('/:id', ...adminOnly, taxController.updateTax);

/**
 * DELETE /api/taxes/:id
 */
router.delete('/:id', ...adminOnly, taxController.deleteTax);

module.exports = router;
