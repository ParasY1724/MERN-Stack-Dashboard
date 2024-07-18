const express = require('express');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const optionalAuth = require('../middleware/optional-auth');
const { body, param } = require('express-validator');


const router = express.Router();
router.get('/likedPosts',isAuth,feedController.getLikedPosts);

router.get('/post/:postId',optionalAuth, feedController.getPost);

router.post('/post', isAuth,feedController.createPost);

router.get('/posts/',feedController.getPosts);
router.get('/posts/:username',feedController.getPosts);

router.get('/recent_post',feedController.recentPost);


router.put('/post/:postId', isAuth, [
    param('postId').isMongoId().withMessage('Invalid post ID'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('mediaURL').optional().isURL().withMessage('Invalid media URL')
], feedController.editPost);

router.put('/like-post/:postId', isAuth, [
    param('postId').isMongoId().withMessage('Invalid post ID')
], feedController.toggleLike);

router.post('/comment/:postId', isAuth, [
    param('postId').isMongoId().withMessage('Invalid post ID'),
    body('content').trim().notEmpty().withMessage('Comment content is required')
], feedController.commentOnPost);

router.put('/like-comment/:commentId', isAuth, [
    param('commentId').isMongoId().withMessage('Invalid comment ID')
], feedController.toggleLikeComment);   

module.exports = router;
