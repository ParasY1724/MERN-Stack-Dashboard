const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1];
    if (!token) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const decodedToken = jwt.verify(token, 'somesupersecretsecret');
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(decodedToken.userId).select('-password');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    req.userId = decodedToken.userId;
    req.user = user;
    next();
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};