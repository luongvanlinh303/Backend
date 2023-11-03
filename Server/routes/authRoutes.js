// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/changePassword', authController.changePassword);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;