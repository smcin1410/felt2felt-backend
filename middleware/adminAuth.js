const jwt = require('jsonwebtoken');
const User = require('../models/user');

// This middleware function is designed to protect routes that should ONLY be accessible by administrators.
// It should be used AFTER the standard 'auth' middleware.
module.exports = async function(req, res, next) {
  try {
    // req.user.id is attached by the preceding 'auth' middleware.
    // We use this ID to find the full user document in the database.
    const user = await User.findById(req.user.id);

    // Check if the user exists and if their role is 'admin'.
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Administrator privileges required.' });
    }

    // If the user is an admin, allow the request to proceed to the next function in the chain.
    next();

  } catch (err) {
    console.error('Error in admin middleware:', err.message);
    res.status(500).send('Server Error');
  }
};
