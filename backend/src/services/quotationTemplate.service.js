const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/quotation-templates
 * Get all quotation templates with their lines
 */
async function getAllTemplates() {
  const templates = await prisma.quotationTemplate.findMany({
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          billingPeriod: true,
        },
      },
      lines: {
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
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return templates;
}

/**
 * GET /api/quotation-templates/:id
 * Get a single quotation template by ID
 */
async function getTemplateById(id) {
  const template = await prisma.quotationTemplate.findUnique({
    where: { id },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          billingPeriod: true,
          price: true,
        },
      },
      lines: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!template) {
    const error = new Error('Quotation template not found');
    error.status = 404;
    throw error;
  }

  return template;
}

/**
 * POST /api/quotation-templates
 * Create a new quotation template with lines
 */
async function createTemplate(data) {
  const { name, planId, lines } = data;

  if (!name || !planId) {
    const error = new Error('name and planId are required');
    error.status = 400;
    throw error;
  }

  // Verify plan exists
  const plan = await prisma.recurringPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    const error = new Error('Recurring plan not found');
    error.status = 404;
    throw error;
  }

  // Verify all products exist if lines provided
  if (lines && lines.length > 0) {
    const productIds = lines.map((line) => line.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      const error = new Error('One or more products not found');
      error.status = 404;
      throw error;
    }
  }

  // Create template with lines in a transaction
  const template = await prisma.quotationTemplate.create({
    data: {
      name,
      planId,
      lines: {
        create: lines || [],
      },
    },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          billingPeriod: true,
        },
      },
      lines: {
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
      },
    },
  });

  return template;
}

/**
 * PUT /api/quotation-templates/:id
 * Update an existing quotation template
 */
async function updateTemplate(id, data) {
  const { name, planId, lines } = data;

  const existing = await prisma.quotationTemplate.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error('Quotation template not found');
    error.status = 404;
    throw error;
  }

  // Verify plan if provided
  if (planId) {
    const plan = await prisma.recurringPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      const error = new Error('Recurring plan not found');
      error.status = 404;
      throw error;
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (planId !== undefined) updateData.planId = planId;

  // If lines are provided, replace all lines
  if (lines) {
    // Verify all products exist
    const productIds = lines.map((line) => line.productId);
    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        const error = new Error('One or more products not found');
        error.status = 404;
        throw error;
      }
    }

    // Delete existing lines and create new ones
    await prisma.quotationTemplateLine.deleteMany({
      where: { templateId: id },
    });

    updateData.lines = {
      create: lines,
    };
  }

  const template = await prisma.quotationTemplate.update({
    where: { id },
    data: updateData,
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          billingPeriod: true,
        },
      },
      lines: {
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
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return template;
}

/**
 * DELETE /api/quotation-templates/:id
 * Delete a quotation template (cascade deletes lines)
 */
async function deleteTemplate(id) {
  const existing = await prisma.quotationTemplate.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error('Quotation template not found');
    error.status = 404;
    throw error;
  }

  // Delete template (lines will be cascade deleted)
  await prisma.quotationTemplate.delete({
    where: { id },
  });

  return { message: 'Quotation template deleted successfully' };
}

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
