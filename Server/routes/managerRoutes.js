const express = require('express');
const authenticate = require('../middlewares/authenticate');
const managerController = require('../controllers/managerController');
const router = express.Router();

// router.get('/myinfor/:user_id', authenticate,authController.getUserById);
router.get('/listGuard', managerController.getListGuard);
router.get('/listGuardFree', managerController.getListGuardFree);
router.get('/listCustomer', managerController.getListCustomer);
router.get('/getAllBooking',managerController.getAllBooking);
router.get('/getDetailBooking/:bookingname', managerController.getDetailBooking);
router.get('/getBookingPayment', managerController.getBookingPayment);
router.get('/getBookingNotPayment', managerController.getBookingNotPayment);
router.get('/getBookingDone', managerController.getBookingDone);
router.get('/getGuardbyBookingname/:bookingname',managerController.getGuardbyBookingname);
router.get('/GetSalaryGuard/:guard_id',managerController.GetSalaryGuard);
router.post('/PickGuard/:bookingname', managerController.PickGuard);
router.post('/EditGuardBooking/:bookingname', managerController.EditGuardBooking);
module.exports = router;