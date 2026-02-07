import api from '../api';

/**
 * Discount Service
 * Handles all API calls related to discounts
 */

export const discountService = {
  /**
   * Get all discounts
   */
  async getAll() {
    const response = await api.get('/api/discounts');
    return response.data;
  },

  /**
   * Get only active discounts (within date range and active status)
   */
  async getActive() {
    const response = await api.get('/api/discounts/active');
    return response.data;
  },

  /**
   * Get a single discount by ID
   */
  async getById(id) {
    const response = await api.get(`/api/discounts/${id}`);
    return response.data;
  },

  /**
   * Create a new discount
   */
  async create(discountData) {
    const response = await api.post('/api/discounts', discountData);
    return response.data;
  },

  /**
   * Update an existing discount
   */
  async update(id, discountData) {
    const response = await api.put(`/api/discounts/${id}`, discountData);
    return response.data;
  },

  /**
   * Delete a discount
   */
  async delete(id) {
    const response = await api.delete(`/api/discounts/${id}`);
    return response.data;
  },
};
