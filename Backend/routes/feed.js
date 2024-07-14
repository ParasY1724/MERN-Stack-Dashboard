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

router.get('/post/:postId',isAuth, feedController.getPost); //done
router.get('/posts',feedController.getPosts); //done
router.get('/posts/:username',feedController.getPosts); //done
router.get('/recent_post',feedController.recentPost);//done
router.post('/post', isAuth, feedController.createPost);//done
router.put('/post/:postId', isAuth, feedController.editPost);
router.put('/like-post/:postId', isAuth, feedController.toggleLike);//done
router.post('/comment/:postId', isAuth, feedController.commentOnPost);//done
router.put('/like-comment/:commentId', isAuth, feedController.toggleLikeComment);//done     

module.exports = router;
