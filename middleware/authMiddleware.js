import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object, excluding the password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        // If user doesn't exist, return unauthorized error
        return res.status(401).json({ message: 'User not found' });
      }

      next();  // Continue to the next middleware
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: 'Not authorized. Token verification failed.' });
    }
  }

  // If no token was provided in the header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
