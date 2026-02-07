import api from '../api.js';

export const paymentService = {
  /**
   * Get all payments (filtered by role on backend)
   * GET /api/payments
   */
  getAll: async () => {
    try {
      const response = await api.get('/api/payments');
      return {
        success: true,
        data: response.data.payments || response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch payments',
        data: [],
      };
    }
  },

  /**
   * Create new payment
   * POST /api/payments
   */
  create: async (paymentData) => {
    try {
      const response = await api.post('/api/payments', paymentData);
      return {
        success: true,
        data: response.data.payment || response.data,
        message: 'Payment created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create payment',
      };
    }
  },
};

export default paymentService;
