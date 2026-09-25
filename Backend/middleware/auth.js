const jwt = require('jsonwebtoken')

// Middleware to protect routes - checks if user has valid JWT
function auth(req, res, next){
  // Get token from header: Authorization: Bearer <token>
  const token = req.header('x-auth-token') || req.headers.authorization?.split(' ')[1]
  
  // If no token, deny access
  if(!token) return res.status(401).json({msg: "No token, authorization denied"})

  try {
    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.id // Add user id to request object
    next() // Allow to continue to tasks route
  } catch(err){
    res.status(401).json({msg: "Token is not valid"})
  }
}

module.exports = auth