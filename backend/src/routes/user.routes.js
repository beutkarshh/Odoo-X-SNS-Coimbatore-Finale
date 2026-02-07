
const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

// Admin-only: create any user type
router.post('/', authenticateToken, authorizeRoles('ADMIN'), userController.createUser);

// Admin-only: list all users
router.get('/', authenticateToken, authorizeRoles('ADMIN'), userController.listUsers);

// ADMIN or INTERNAL: list only customers (for subscription creation)
router.get('/customers', authenticateToken, authorizeRoles('ADMIN', 'INTERNAL'), userController.listCustomers);

// ADMIN or INTERNAL: create customer only (for subscription creation)
router.post('/customers', authenticateToken, authorizeRoles('ADMIN', 'INTERNAL'), userController.createCustomer);

module.exports = router;

