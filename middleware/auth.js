const jwt = require('jsonwebtoken');

// Middleware to protect routes - checks if user has valid token
module.exports = function (req, res, next) {
  // Get token from header x-auth-token (sent from Postman)
  const token = req.header('x-auth-token');

  // If no token, user is not allowed - 401 Unauthorized
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token is valid using our secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info from token to request object
    req.user = decoded.user;
    
    // Go to next function (create task, get tasks, etc.)
    next();
  } catch (err) {
    // Token is invalid or expired
    res.status(401).json({ msg: 'Token is not valid' });
  }
};