const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const { email, name, username, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPw, name, username });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.getProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (username === req.user.username) {
      return res.status(200).json({ user: req.user.select('-likes') });
    }
    const user = await User.findOne({ username }).select('-password -likes').lean();
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    const isFollowed = req.user && req.user.progress.following.includes(user._id);
    user.progress.following = user.progress.following.length;
    user.progress.followers = user.progress.followers.length;
    res.status(200).json({ user, isFollowed });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.editProfile = async (req, res, next) => {
  const { email, name, about, profilePic, socialURL } = req.body;
  try {
    const user = req.user;
    Object.assign(user, { email, name, about, profilePic, socialURL });
    const updatedUser = await user.save();
    res.status(200).json({ message: 'User updated!', user: updatedUser });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.toggleFollow = async (req, res, next) => {
  const { followId } = req.body;
  try {
    if (followId.toString() === req.user._id.toString()) {
      const error = new Error("Can't follow own account");
      error.statusCode = 403;
      throw error;
    }
    const [user, followUser] = await Promise.all([
      User.findById(req.user._id),
      User.findById(followId)
    ]);
    if (!user || !followUser) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    const isFollowing = user.progress.following.includes(followId);
    const updateOp = isFollowing ? '$pull' : '$push';
    await Promise.all([
      User.updateOne({ _id: user._id }, { [updateOp]: { 'progress.following': followId } }),
      User.updateOne({ _id: followUser._id }, { [updateOp]: { 'progress.followers': user._id } })
    ]);
    res.status(200).json({ message: 'Follow status updated!' });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};


exports.getUser = (req,res,next) => {
  if (req.user){
    res.status(200).json({user:req.user});
  }
}