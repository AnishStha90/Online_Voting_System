const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and is a Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (user info) to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Handle token errors explicitly
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

exports.isAdmin = (req, res, next) => {
  // Check if user info is attached to the request
  if (!req.user) {
    return res.status(403).json({ error: 'Access denied. User not authenticated.' });
  }

  // Check if user role is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  // User is admin, proceed
  next();
};
