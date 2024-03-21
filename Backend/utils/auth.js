const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Generate a JWT token with user information.
 * @param {string} userId - User ID
 * @param {string} username - Username
 * @param {string} role - User role
 * @returns {string} JWT token
 */

const generateToken = (userId, username, role) => {
  return jwt.sign({ userId, username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {boolean} True if the password is valid, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateToken,
  comparePassword,
};
