const taxService = require('../services/tax.service');

/**
 * GET /api/taxes
 */
async function getAllTaxes(req, res, next) {
  try {
    const taxes = await taxService.getAllTaxes();
    return res.status(200).json({ success: true, data: taxes });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/taxes/:id
 */
async function getTaxById(req, res, next) {
  try {
    const tax = await taxService.getTaxById(req.params.id);
    return res.status(200).json({ success: true, data: tax });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/taxes
 */
async function createTax(req, res, next) {
  try {
    const tax = await taxService.createTax(req.body);
    return res.status(201).json({ success: true, data: tax });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/taxes/:id
 */
async function updateTax(req, res, next) {
  try {
    const tax = await taxService.updateTax(req.params.id, req.body);
    return res.status(200).json({ success: true, data: tax });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/taxes/:id
 */
async function deleteTax(req, res, next) {
  try {
    await taxService.deleteTax(req.params.id);
    return res.status(200).json({ success: true, message: 'Tax deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTaxes,
  getTaxById,
  createTax,
  updateTax,
  deleteTax,
};
