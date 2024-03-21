// adminMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user is an admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = adminMiddleware;
