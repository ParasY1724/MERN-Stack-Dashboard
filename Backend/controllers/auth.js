const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
      username: username
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username })
      .select('-password -likes')
      .lean();

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (user._id.toString() !== req.userId.toString()) {
      user.progress.following = user.progress.following.length;
      user.progress.followers = user.progress.followers.length;
    }

    res.status(200).json(user);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  const userId = req.userId;
  const { email, name, about, profilePic, socialURL } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    user.email = email || user.email;
    user.name = name || user.name;
    user.about = about || user.about;
    user.profilePic = profilePic || user.profilePic;
    user.socialURL = socialURL || user.socialURL;

    const updatedUser = await user.save();
    res.status(200).json({ message: 'User updated!', user: updatedUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.toggleFollow = async (req, res, next) => {
  const userId = req.userId;
  const { followId } = req.body;

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const isFollowing = user.progress.following.includes(followId);

    if (isFollowing) {
      user.progress.following.pull(followId);
      followUser.progress.followers.pull(userId);
    } else {
      user.progress.following.push(followId);
      followUser.progress.followers.push(userId);
    }

    await user.save();
    await followUser.save();

    res.status(200).json({ message: 'Follow status updated!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
