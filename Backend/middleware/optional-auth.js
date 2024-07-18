const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const optionalAuth = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      req.user = null;
      return next();
    }
    
    const user = await User.findById(decodedToken.userId).select('-password');
    await user.populate('progress.following', '_id username profilePic');
    await user.populate('progress.followers', '_id username profilePic');
    if (!user) {
      req.user = null;
      return next();
    }
    
    req.userId = decodedToken.userId;
    req.user = user;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

module.exports = optionalAuth;