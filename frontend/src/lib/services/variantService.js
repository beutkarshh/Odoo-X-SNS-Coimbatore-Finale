import api from '../api';

/**
 * Product Variant Service
 * Handles all API calls related to product variants
 */

export const variantService = {
  /**
   * Get all product variants, optionally filtered by product ID
   */
  async getAll(productId = null) {
    const params = productId ? { productId } : {};
    const response = await api.get('/api/product-variants', { params });
    return response.data;
  },

  /**
   * Get a single product variant by ID
   */
  async getById(id) {
    const response = await api.get(`/api/product-variants/${id}`);
    return response.data;
  },

  /**
   * Create a new product variant
   */
  async create(variantData) {
    const response = await api.post('/api/product-variants', variantData);
    return response.data;
  },

  /**
   * Update an existing product variant
   */
  async update(id, variantData) {
    const response = await api.put(`/api/product-variants/${id}`, variantData);
    return response.data;
  },

  /**
   * Delete a product variant
   */
  async delete(id) {
    const response = await api.delete(`/api/product-variants/${id}`);
    return response.data;
  },
};
