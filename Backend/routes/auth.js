const express = require('express');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const optionalAuth = require('../middleware/optional-auth');
const upload = require('../cloudinary');
const { body } = require('express-validator');


const router = express.Router();

router.get('/users/:username',optionalAuth,authController.getProfile);
router.post(
    '/signup',
    upload.single('profilePic'),
    [
      body('email').isEmail().withMessage('Please enter a valid email'),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('username').trim().not().isEmpty().withMessage('Username is required'),
      body('name').trim().not().isEmpty().withMessage('Name is required')
    ],
    authController.signup
  );

router.get('/search', authController.search);

router.post('/login', authController.login);

router.put('/edit-profile', isAuth, [
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('about').optional().trim(),
  body('socialURL').optional().isArray(),
  body('socialURL.*').optional().isURL().withMessage('Invalid URL format')
], authController.editProfile);

router.put('/toggle-follow', isAuth, [
  body('followId').isMongoId().withMessage('Invalid user ID')
], authController.toggleFollow);

router.get('/get-user',isAuth,authController.getUser);
module.exports = router;
