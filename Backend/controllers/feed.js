const Post = require('../models/post');
const Comment = require('../models/commet');
const User = require('../models/user');
const upload = require('../cloudinary');
const { validationResult } = require('express-validator');

const LevelArray = ['Novice','Apprentice','Journeyman','Expert','Master','Grandmaster'];

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate('creator', '-password -likes')
      .populate('comments')
      .lean();
    
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }
    
    post.creator.progress = {
      following: post.creator.progress.following.length,
      followers: post.creator.progress.followers.length
    };
    
    const isLiked = req.user && req.user.likes.includes(postId);
    const isFollowed = req.user && req.user.progress.following.includes(post.creator._id);
    
    if (req.user) {
      post.comments = post.comments.map(comment => ({
        ...comment,
        isLikedByCurrentUser: comment.likedBy.some(user => user._id.toString() === req.user._id.toString()),
        likedBy: comment.likedBy.length
      }));
    } else {
      post.comments = post.comments.map(comment => ({
        ...comment,
        likedBy: comment.likedBy.length
      }));
    }
    res.status(200).json({ post, isLiked, isFollowed });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.getPosts = async (req,res,next) => {
  const {username} = req.params;
  let posts;
  try{
    if (username){
      const user = await User.findOne({username : username});
      posts = await Post.find({ 'creator': user._id }).populate('creator', '-password').sort({createdAt : -1});
    }
    else{
      posts = await Post.find().populate('creator', '-password').sort({createdAt : -1});
    }
    res.status(200).json({posts : posts});
  }
  catch (err){
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
}

exports.createPost = [
  upload.single('media'), 
  async (req, res, next) => {
    
    const { title, content, tags } = req.body;
    let mediaURL = '';
    let mediaType = '';

    if (req.file) {
      mediaURL = req.file.path;
      
      if (req.file.mimetype.startsWith('image/')) {
        mediaType = 'image';
      } else if (req.file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      }
    }
    
    try {
      const post = new Post({ 
        title, 
        content, 
        mediaURL, 
        mediaType, 
        creator: req.user._id,
        tags: JSON.parse(tags)
      });
      
      const result = await post.save();

      // Update user's progress
      req.user.progress.exp += 25;
      req.user.progress.level = LevelArray[Math.min(parseInt(req.user.progress.exp / 100), LevelArray.length - 1)];
      await req.user.save();

      res.status(201).json({ message: 'Post created!', post: result });
    } catch (err) {
      console.log(err);
      next(err.statusCode ? err : { ...err, statusCode: 500 });
    }
  }
];


exports.getUserPosts = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ creator: userId });
    res.status(200).json({ posts });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.editPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { postId } = req.params;
  const { content, mediaURL } = req.body;
  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, creator: req.user._id },
      { content, mediaURL },
      { new: true }
    );
    if (!post) {
      const error = new Error('Post not found or not authorized.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post updated!', post });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.toggleLike = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }
    const isLiked = req.user.likes.includes(postId);
    const updateOp = isLiked ? '$pull' : '$push';
    const likesDelta = isLiked ? -1 : 1;
    
    const [userUpdate, postUpdate] = await Promise.all([
      User.updateOne({ _id: req.user._id }, { [updateOp]: { likes: postId } }),
      Post.findByIdAndUpdate(postId, { $inc: { likes: likesDelta } }, { new: true })
    ]);

    res.status(200).json({ 
      message: isLiked ? 'Post Unliked!' : 'Post Liked!', 
      likes: postUpdate.likes,
      isLiked: !isLiked
    });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.commentOnPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }
    const comment = new Comment({
      content,
      username: req.user.username,
      profilePic: req.user.profilePic,
    });
    post.comments.push(comment);
    //update level
    req.user.progress.exp += 15;
    req.user.progress.level = LevelArray[parseInt(req.user.progress.exp / 100)];
    
    await Promise.all([comment.save(), post.save(),req.user.save()]);
    res.status(201).json({ message: 'Comment added!', comment });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.toggleLikeComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error('Comment not found.');
      error.statusCode = 404;
      throw error;
    }
    const isLiked = comment.likedBy.includes(req.user._id);
    const updateOp = isLiked ? '$pull' : '$push';
    await Comment.updateOne({ _id: commentId }, { [updateOp]: { likedBy: req.user._id } });
    const updatedComment = await Comment.findById(commentId);
    res.status(200).json({ message: 'Comment like toggled!', likes: updatedComment.likedBy.length });
  } catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.recentPost = async (req, res , next) => {
  try {
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'creator',
        select: 'username profilePic'
      });
    res.json(recentPosts);
  } 
  catch (err) {
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};

exports.getLikedPosts = async (req,res,next) => {
  const user = req.user;
  try{
    if (!user){
      const error = new Error('Not Authorized.');
      error.statusCode = 403;
      throw error;
    }
    const posts = await Post.find({ _id: { $in: req.user.likes } }).populate('creator','_id username profilePic');
    res.status(200).json({posts});
  }
  catch (err){
    next(err.statusCode ? err : { ...err, statusCode: 500 });
  }
};