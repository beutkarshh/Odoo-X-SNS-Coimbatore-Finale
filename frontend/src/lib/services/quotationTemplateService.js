import api from '../api';

/**
 * Quotation Template Service
 * Handles all API calls related to quotation templates
 */

export const quotationTemplateService = {
  /**
   * Get all quotation templates with their lines
   */
  async getAll() {
    const response = await api.get('/api/quotation-templates');
    return response.data;
  },

  /**
   * Get a single quotation template by ID
   */
  async getById(id) {
    const response = await api.get(`/api/quotation-templates/${id}`);
    return response.data;
  },

  /**
   * Create a new quotation template with lines
   */
  async create(templateData) {
    const response = await api.post('/api/quotation-templates', templateData);
    return response.data;
  },

  /**
   * Update an existing quotation template
   */
  async update(id, templateData) {
    const response = await api.put(`/api/quotation-templates/${id}`, templateData);
    return response.data;
  },

  /**
   * Delete a quotation template
   */
  async delete(id) {
    const response = await api.delete(`/api/quotation-templates/${id}`);
    return response.data;
  },
};
