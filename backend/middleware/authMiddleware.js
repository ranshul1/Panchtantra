const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  console.log('Session:', req.session); // Log session details
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user details to request object
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, session expired' });
  }
};


module.exports = { protect };
