const express = require('express');
const authenticate = require('../middlewares/authenticate');
const customerController = require('../controllers/customerController');

const router = express.Router();

// router.get('/myinfor/:user_id', authenticate,authController.getUserById);
router.get('/myinfor/:user_id', customerController.getUserById);
router.post('/changeinfor/:user_id', customerController.changeUserInfo);
router.get('/getAllGuard', customerController.getAllGuard);
router.get('/getInfoGuardbyID/:user_id', customerController.getInfoGuardbyID);
router.get('/getmyBooking/:user_id', customerController.getmyBooking);
router.post('/createBooking/:user_id', customerController.createBooking);
module.exports = router;