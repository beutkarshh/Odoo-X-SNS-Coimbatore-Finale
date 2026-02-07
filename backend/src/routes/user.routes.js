

const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

// Admin-only
router.post('/', authenticateToken, authorizeRoles('ADMIN'), userController.createUser);
router.get('/', authenticateToken, authorizeRoles('ADMIN'), userController.listUsers);

module.exports = router;

