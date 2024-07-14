const express = require('express');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const upload = require('../cloudinary');
const { body } = require('express-validator');

const router = express.Router();

router.get('/users/:username',isAuth,authController.getProfile);//done
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
router.post('/login', authController.login);//done
router.put('/edit-profile', isAuth, authController.editProfile);
router.put('/toggle-follow', isAuth, authController.toggleFollow);//done
router.get('/get-user',isAuth,authController.getUser);//done
module.exports = router;
