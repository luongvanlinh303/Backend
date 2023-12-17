const express = require("express");
const multer = require('multer');
const authenticate = require("../middlewares/authenticate");
const GuardController = require("../controllers/guardController");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.get("/myinfor/:user_id", authenticate, GuardController.getUserById);
router.post('/changePassword', GuardController.changePassword);
// router.get('/myinfor/:user_id', GuardController.getUserById);
router.post('/changeimg/:user_id', GuardController.changeUserImg);
router.post('/changeinfor/:user_id', GuardController.changeUserInfo);
router.get('/getInfoCustomerbyID/:user_id', GuardController.getInfoCustomerbyID);
router.get('/getDetailBooking/:bookingname', GuardController.getDetailBooking);
router.get('/getDetailBookingOneDay', GuardController.getDetailBookingOneDay);
router.get('/getListMyBooking/:user_id', GuardController.getListMyBooking);
router.get('/getmyBooking/:user_id', GuardController.getmyBooking);
router.get('/getmyFeedback/:user_id', GuardController.getMyFeedBack);
router.get('/getMyNoti/:guard_id',GuardController.getMyNoti)
module.exports = router;
