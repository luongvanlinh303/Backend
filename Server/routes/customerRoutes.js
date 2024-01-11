const express = require('express');
const multer = require('multer');
const customerController = require('../controllers/customerController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer endpoints
 */

/**
 * @swagger
 * /myinfor/{user_id}:
 *   get:
 *     summary: Get user information by ID
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get('/myinfor/:user_id', customerController.getUserById);

/**
 * @swagger
 * /changeimg/{user_id}:
 *   post:
 *     summary: Change user image
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User image changed successfully
 *       400:
 *         description: Invalid user ID or image format
 *       500:
 *         description: Internal server error
 */
router.post('/changeimg/:user_id', customerController.changeUserImg);

/**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Change user password
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request body or user ID
 *       500:
 *         description: Internal server error
 */
router.post('/changePassword', customerController.changePassword);

/**
 * @swagger
 * /changeinfor/{user_id}:
 *   post:
 *     summary: Change user information
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *               - address
 *     responses:
 *       200:
 *         description: User information changed successfully
 *       400:
 *         description: Invalid request body or user ID
 *       500:
 *         description: Internal server error
 */
router.post('/changeinfor/:user_id', customerController.changeUserInfo);

/**
 * @swagger
 * /getAllGuard:
 *   get:
 *     summary: Get all guards
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Guards retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getAllGuard', customerController.getAllGuard);

/**
 * @swagger
 * /getInfoGuardbyID/{user_id}:
 *   get:
 *     summary: Get guard information by ID
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the guard
 *     responses:
 *       200:
 *         description: Guard information retrieved successfully
 *       400:
 *         description: Invalid guard ID
 *       500:
 *         description: Internal server error
 */
router.get('/getInfoGuardbyID/:user_id', customerController.getInfoGuardbyID);

/**
 * @swagger
 * /getmyBooking/{user_id}:
 *   get:
 *     summary: Get bookings of a user
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
     *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get('/getmyBooking/:user_id', customerController.getmyBooking);

/**
 * @swagger
 * /getDetailBooking/{bookingname}:
 *   get:
 *     summary: Get details of a booking by booking name
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *         description: Internal server error
 */
router.get('/getDetailBooking/:bookingname', customerController.getDetailBooking);

/**
 * @swagger
 * /getDetailBookingOneDay:
 *   get:
 *     summary: Get details of bookings for a specific day
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getDetailBookingOneDay', customerController.getDetailBookingOneDay);

/**
 * @swagger
 * /gettoprank:
 *   get:
 *     summary: Get top ranked guards
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Top ranked guards retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/gettoprank', customerController.GetFeedBack);

/**
 * @swagger
 * /createBooking/{user_id}:
 *   post:
 *     summary: Create a new booking
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingName:
 *                 type: string
 *               guardId:
 *                 type: string
 *             required:
 *               - bookingName
 *               - guardId
 *     responses:
 *       200:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid request body or user ID
 *       500:
 *         description: Internal server error
 */
router.post('/createBooking/:user_id', customerController.createBooking);

/**
 * @swagger
 * /attendence:
 *   post:
 *     summary: Mark attendance
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               guardId:
 *                 type: string
 *             required:
 *               - userId
 *               - guardId
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/attendence', customerController.Attendence);

/**
 * @swagger
 * /editattendence:
 *   post:
 *     summary: Edit guard's attendance
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendanceId:
 *                 type: string
 *               userId:
 *                 type: string
 *               guardId:
 *                 type: string
 *             required:
 *               - attendanceId
 *               - userId
 *               - guardId
 *     responses:
 *       200:
 *         description: Guard's attendance edited successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/editattendence', customerController.EditGuardAttendence);
/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Make a payment
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - userId
 *               - amount
 *     responses:
 *       200:
 *         description: Payment made successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/payment', customerController.Payment);

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Post feedback
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               feedback:
 *                 type: string
 *             required:
 *               - userId
 *               - feedback
 *     responses:
 *       200:
 *         description: Feedback posted successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/feedback', customerController.PostFeedBack);

/**
 * @swagger
 * /CancelBooking/{bookingname}:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *         description: Internal server error
 */
router.post('/CancelBooking/:bookingname', customerController.CancelBooking);

/**
 * @swagger
 * /getBookingNotPayment/{customer_id}:
 *   get:
 *     summary: Get unpaid bookings of a customer
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Unpaid bookings retrieved successfully
 *       400:
 *         description: Invalid customer ID
 *       500:
 *         description: Internal server error
 */
router.get('/getBookingNotPayment/:customer_id', customerController.getBookingNotPayment);

/**
 * @swagger
 * /getBookingPayment/{customer_id}:
 *   get:
 *     summary: Get paid bookings of a customer
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Paid bookings retrieved successfully
 *       400:
 *         description: Invalid customer ID
 *       500:
 *         description: Internal server error
 */
router.get('/getBookingPayment/:customer_id', customerController.getBookingPayment);

/**
 * @swagger
 * /getMyNoti/{customer_id}:
 *   get:
 *     summary: Get notifications of a customer
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       400:
 *         description: Invalid customer ID
 *       500:
 *         description: Internal server error
 */
router.get('/getMyNoti/:customer_id', customerController.getMyNoti);
/**
 * @swagger
 * /payment/{customer_id}:
 *   get:
 *     summary: Get payment of a customer
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       400:
 *         description: Invalid customer ID
 *       500:
 *         description: Internal server error
 */
router.get('/getpayment/:customer_id', customerController.getpayment);
/**
 * @swagger
 * /RequestChangeGuard:
 *   post:
 *     summary: Request to change guard for a booking
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *               guardId:
 *                 type: string
 *             required:
 *               - customerId
 *              - bookingId
 *               - guardId
 *     responses:
 *       200:
 *         description: Guard change request sent successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/RequestChangeGuard', customerController.RequestChangeGuard);

module.exports = router;