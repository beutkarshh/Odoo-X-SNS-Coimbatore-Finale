const { PrismaClient } = require('@prisma/client');
const { comparePassword, hashPassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} User data and JWT token
 * @throws {Error} If credentials are invalid
 */
async function login(email, password) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      isActive: true,
    },
  });

  // Check if user exists
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Check if user is active
  if (!user.isActive) {
    const err = new Error('Account is inactive');
    err.statusCode = 403;
    throw err;
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token,
  };
}

/**
 * Register new customer user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} User data and JWT token
 * @throws {Error} If email already exists
 */
async function register(name, email, password) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 400;
    throw err;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new customer user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'PORTAL',
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
}

/**
 * Get user profile by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User data
 */
async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = {
  login,
  register,
  getUserProfile,
};

