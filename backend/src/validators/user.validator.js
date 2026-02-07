const ALLOWED_ROLES = ['ADMIN', 'INTERNAL', 'PORTAL'];

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function isStrongPassword(password) {
	// Min 8 chars, 1 upper, 1 lower, 1 number, 1 special
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(String(password || ''));
}

function validateCreateUser(body) {
	const email = body?.email;
	const password = body?.password;
	const name = body?.name;
	const role = body?.role;
	const isActive = body?.isActive;

	if (!email || !password || !name || !role) {
		const err = new Error('email, password, name, and role are required');
		err.statusCode = 400;
		throw err;
	}

	if (!isValidEmail(email)) {
		const err = new Error('Invalid email');
		err.statusCode = 400;
		throw err;
	}

	if (!ALLOWED_ROLES.includes(role)) {
		const err = new Error('Invalid role');
		err.statusCode = 400;
		throw err;
	}

	if (role === 'ADMIN') {
		const err = new Error('Creating ADMIN users is not allowed in this endpoint');
		err.statusCode = 400;
		throw err;
	}

	if (!isStrongPassword(password)) {
		const err = new Error(
			'Password must be at least 8 chars and include uppercase, lowercase, number, and special character'
		);
		err.statusCode = 400;
		throw err;
	}

	if (typeof isActive !== 'undefined' && typeof isActive !== 'boolean') {
		const err = new Error('isActive must be a boolean');
		err.statusCode = 400;
		throw err;
	}

	return {
		email: String(email).trim().toLowerCase(),
		password: String(password),
		name: String(name).trim(),
		role,
		isActive: typeof isActive === 'boolean' ? isActive : true,
	};
}

module.exports = {
	validateCreateUser,
};
