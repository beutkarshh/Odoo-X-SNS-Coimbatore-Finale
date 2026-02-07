const express = require('express');
const templateController = require('../controllers/quotationTemplate.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

// All quotation template routes require authentication
// ADMIN and INTERNAL can create/manage templates
const adminAndInternal = [authenticateToken, authorizeRoles('ADMIN', 'INTERNAL')];

/**
 * GET /api/quotation-templates
 */
router.get('/', ...adminAndInternal, templateController.getAllTemplates);

/**
 * GET /api/quotation-templates/:id
 */
router.get('/:id', ...adminAndInternal, templateController.getTemplateById);

/**
 * POST /api/quotation-templates
 */
router.post('/', ...adminAndInternal, templateController.createTemplate);

/**
 * PUT /api/quotation-templates/:id
 */
router.put('/:id', ...adminAndInternal, templateController.updateTemplate);

/**
 * DELETE /api/quotation-templates/:id
 */
router.delete('/:id', ...adminAndInternal, templateController.deleteTemplate);

module.exports = router;
