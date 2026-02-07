const templateService = require('../services/quotationTemplate.service');

/**
 * GET /api/quotation-templates
 */
async function getAllTemplates(req, res, next) {
  try {
    const templates = await templateService.getAllTemplates();
    return res.status(200).json({ success: true, data: templates });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/quotation-templates/:id
 */
async function getTemplateById(req, res, next) {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    return res.status(200).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/quotation-templates
 */
async function createTemplate(req, res, next) {
  try {
    const template = await templateService.createTemplate(req.body);
    return res.status(201).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/quotation-templates/:id
 */
async function updateTemplate(req, res, next) {
  try {
    const template = await templateService.updateTemplate(req.params.id, req.body);
    return res.status(200).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/quotation-templates/:id
 */
async function deleteTemplate(req, res, next) {
  try {
    await templateService.deleteTemplate(req.params.id);
    return res.status(200).json({ success: true, message: 'Quotation template deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
