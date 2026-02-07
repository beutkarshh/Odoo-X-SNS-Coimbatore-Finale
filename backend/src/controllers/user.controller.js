

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

module.exports = {
	createUser,
	listUsers,
};

