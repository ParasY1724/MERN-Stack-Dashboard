const express = require('express');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/users/:username', authController.getProfile);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/edit-profile', isAuth, authController.editProfile);
router.put('/toggle-follow', isAuth, authController.toggleFollow);

module.exports = router;
