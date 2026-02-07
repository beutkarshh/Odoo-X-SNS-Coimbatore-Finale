const { prisma } = require('../config/db');
const { hashPassword } = require('../utils/hash');

function toPublicUser(user) {
	if (!user) return user;
	// eslint-disable-next-line no-unused-vars
	const { password, ...rest } = user;
	return rest;
}

async function createUser(payload) {
	const { email, password, name, role, isActive } = payload;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		const err = new Error('Email already exists');
		err.statusCode = 409;
		throw err;
	}

	const hashedPassword = await hashPassword(password);

	const created = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			role,
			isActive,
		},
	});

	return toPublicUser(created);
}

async function listUsers(query) {
	const page = Math.max(1, Number(query.page || 1));
	const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
	const skip = (page - 1) * pageSize;

	const where = {};

	if (query.role) {
		where.role = query.role;
	}

	if (typeof query.isActive !== 'undefined') {
		if (query.isActive === 'true' || query.isActive === true) where.isActive = true;
		if (query.isActive === 'false' || query.isActive === false) where.isActive = false;
	}

	if (query.q) {
		where.OR = [
			{ email: { contains: String(query.q), mode: 'insensitive' } },
			{ name: { contains: String(query.q), mode: 'insensitive' } },
		];
	}

	const [total, users] = await Promise.all([
		prisma.user.count({ where }),
		prisma.user.findMany({
			where,
			skip,
			take: pageSize,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				isActive: true,
				createdAt: true,
			},
		}),
	]);

	return {
		page,
		pageSize,
		total,
		items: users,
	};
}

module.exports = {
	createUser,
	listUsers,
};
