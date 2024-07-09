const Post = require('../models/post');
const Comment = require('../models/commet');
const commet = require('../models/commet');

// Get a post
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  let isLiked = false;
  let isFollowed = false;
  try {
    const post = await Post.findById(postId).populate('creator', '-password -likes').populate('comments').lean();
    
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }
    
    post.creator.progress.following = post.creator.progress.following.length;
    post.creator.progress.followers = post.creator.progress.followers.length;
    
    if (req.user && ! req.user.likes.include(postId) ){
      isLiked = true;
    }

    if (req.user && ! req.user.progress.following.include(post.creator._id)){
      isFollowed = true;
    }
    if (req.user){
      post.comments = post.comments.map(comment => ({
        ...comment,
        isLikedByCurrentUser: comment.likedBy.some(user => user._id.toString() === currentUserId.toString())
      }));
    }
    
    post.comments = post.comments.map( comment => ({
      ...comment,
      likedBy: comment.likedBy.length
    }));

    res.status(200).json({ post,isLiked: isLiked ,isFollowed: isFollowed });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Create a post
exports.createPost = async (req, res, next) => {
  const { content, mediaURL } = req.body;

  try {
    const post = new Post({
      content,
      mediaURL,
      creator: req.user._id,
    });

    const result = await post.save();
    res.status(201).json({ message: 'Post created!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get user posts
exports.getUserPosts = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const posts = await Post.find({ creator: userId });
    res.status(200).json({ posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Edit a post
exports.editPost = async (req, res, next) => {
  const postId = req.params.postId;
  const { content, mediaURL } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.user._id) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    post.content = content;
    post.mediaURL = mediaURL;

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated!', post: updatedPost });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Like a post
exports.toggleLike = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }
    let message;
    if (req.user.likes.include(postId)){
      post.likes -= 1;
      req.user.likes.pull(postId);
      message = 'Post Unliked !';
    }
    else{
      post.likes += 1;
      req.user.likes.push(postId);
      message = 'Post liked !';
    }
    const user = await user.save();
    const updatedPost = await post.save();
    res.status(200).json({ message: message, post: updatedPost });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Comment on a post
exports.commentOnPost = async (req, res, next) => {
  const postId = req.params.postId;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Post not found.');
      error.statusCode = 404;
      throw error;
    }

    const comment = new Comment({
      content: content,
      username: req.body.username,
      profilePic: req.body.profilePic,
    });

    post.comments.push(comment);
    await comment.save();
    const updatedPost = await post.save();
    res.status(201).json({ message: 'Comment added!', post: updatedPost });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Like a comment
exports.toggleLikeComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.userId;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        const error = new Error('Comment not found.');
        error.statusCode = 404;
        throw error;
      }
  
      if (comment.likedBy.includes(userId)) {
        comment.pull(userId);
      }
      else{
        comment.likedBy.push(userId);
      }
  
      const updatedComment = await comment.save();
      res.status(200).json({ message: 'Comment liked!', likes: updatedComment.likedBy.length });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };