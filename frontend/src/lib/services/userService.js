import api from '../api.js';

export const userService = {
  /**
   * Get all users (Admin only)
   * GET /api/users
   */
  getAll: async () => {
    try {
      const response = await api.get('/api/users');
      return {
        success: true,
        data: response.data.users || response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch users',
        data: [],
      };
    }
  },

  /**
   * Create new user (Admin only)
   * POST /api/users
   */
  create: async (userData) => {
    try {
      const response = await api.post('/api/users', userData);
      return {
        success: true,
        data: response.data.user || response.data,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create user',
      };
    }
  },
};

export default userService;
