//GET post
//Ceate Post
//get user post
//Edit post 
//Like Post
//comment
//like comment

const express = require('express');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/post/:postId', feedController.getPost);
router.post('/post', isAuth, feedController.createPost);
router.get('/user-posts/:userId', isAuth, feedController.getUserPosts);
router.put('/post/:postId', isAuth, feedController.editPost);
router.put('/like-post/:postId', isAuth, feedController.likePost); //add to user list
router.post('/comment/:postId', isAuth, feedController.commentOnPost);
router.put('/like-comment/:commentId', isAuth, feedController.likeComment);

module.exports = router;
