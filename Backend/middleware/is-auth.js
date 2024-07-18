const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1];
    if (!token) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const decodedToken = jwt.verify(token,process.env.SECRET);
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(decodedToken.userId).select('-password');
    await user.populate('progress.following', '_id username profilePic');
    await user.populate('progress.followers', '_id username profilePic');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    req.userId = decodedToken.userId;
    req.user = user;
    next();
  }
  catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};