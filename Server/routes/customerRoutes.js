const express = require('express');
const multer = require('multer');
const authenticate = require('../middlewares/authenticate');
const customerController = require('../controllers/customerController');

const router = express.Router();
router.get('/myinfor/:user_id', customerController.getUserById);
router.post('/changeimg/:user_id', customerController.changeUserImg);
router.post('/changePassword', customerController.changePassword);
router.post('/changeinfor/:user_id', customerController.changeUserInfo);
router.get('/getAllGuard', customerController.getAllGuard);
router.get('/getInfoGuardbyID/:user_id', customerController.getInfoGuardbyID);
router.get('/getmyBooking/:user_id', customerController.getmyBooking);
router.get('/getDetailBooking/:bookingname', customerController.getDetailBooking);
router.get('/getDetailBookingOneDay', customerController.getDetailBookingOneDay);
router.get('/gettoprank', customerController.GetFeedBack);
router.post('/createBooking/:user_id', customerController.createBooking);
router.post('/attendence', customerController.Attendence);
router.post('/editattendence', customerController.EditGuardAttendence);
router.post('/payment', customerController.Payment);
router.post('/feedback', customerController.PostFeedBack);
router.post('/CancelBooking/:bookingname', customerController.CancelBooking);
router.get('/getBookingNotPayment/:customer_id',customerController.getBookingNotPayment);
router.get('/getBookingPayment/:customer_id',customerController.getBookingPayment);
router.get('/getMyNoti/:customer_id',customerController.getMyNoti)
router.post('/RequestChangeGuard',customerController.RequestChangeGuard)
module.exports = router;