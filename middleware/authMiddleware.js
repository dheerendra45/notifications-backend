const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware entered");

  // Extract token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");

}
console.log("JWT Secret in Middleware:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Find user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user data to the request object
    req.user = { id: user._id, role: user.role };
    console.log("User attached to request:", req.user);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
