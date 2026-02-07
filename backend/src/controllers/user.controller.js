

const userService = require('../services/user.service');
const { validateCreateUser } = require('../validators/user.validator');

/**
 * POST /api/users
 * Admin-only: create INTERNAL / PORTAL user
 */
async function createUser(req, res, next) {
	try {
		const payload = validateCreateUser(req.body);
		const user = await userService.createUser(payload);

		return res.status(201).json({ success: true, data: user });
	} catch (err) {
		return next(err);
	}
}

/**
 * GET /api/users
 * Admin-only: list users
 */
async function listUsers(req, res, next) {
	try {
		const result = await userService.listUsers(req.query);
		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		return next(err);
	}
}

/**
 * GET /api/users/customers
 * ADMIN/INTERNAL: list only customer users (PORTAL role)
 */
async function listCustomers(req, res, next) {
	try {
		const result = await userService.listUsers({ ...req.query, role: 'PORTAL' });
		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		return next(err);
	}
}

/**
 * POST /api/users/customers
 * ADMIN/INTERNAL: create a customer account (role locked to PORTAL)
 */
async function createCustomer(req, res, next) {
	try {
		const { email, password, name } = req.body;
		
		if (!email || !password || !name) {
			const err = new Error('email, password, and name are required');
			err.statusCode = 400;
			throw err;
		}
		
		// Force role to PORTAL - internal users cannot create admin/internal accounts
		const user = await userService.createUser({
			email,
			password,
			name,
			role: 'PORTAL',
			isActive: true
		});

		return res.status(201).json({ success: true, data: user });
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	createUser,
	listUsers,
	listCustomers,
	createCustomer,
};

