import api from '../api';

/**
 * Tax Service
 * Handles all API calls related to taxes
 */

export const taxService = {
  /**
   * Get all taxes
   */
  async getAll() {
    const response = await api.get('/api/taxes');
    return response.data;
  },

  /**
   * Get a single tax by ID
   */
  async getById(id) {
    const response = await api.get(`/api/taxes/${id}`);
    return response.data;
  },

  /**
   * Create a new tax
   */
  async create(taxData) {
    const response = await api.post('/api/taxes', taxData);
    return response.data;
  },

  /**
   * Update an existing tax
   */
  async update(id, taxData) {
    const response = await api.put(`/api/taxes/${id}`, taxData);
    return response.data;
  },

  /**
   * Delete a tax
   */
  async delete(id) {
    const response = await api.delete(`/api/taxes/${id}`);
    return response.data;
  },
};
