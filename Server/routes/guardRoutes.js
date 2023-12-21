const express = require("express");
const multer = require('multer');
const GuardController = require("../controllers/guardController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
/**
 * @swagger
 * tags:
 *   name: Guard
 *   description: Guard endpoints
 */

/**
 * @swagger
 * /myinfor/{user_id}:
 *   get:
 *     summary: Get user information by ID
 *     tags: [Guard]
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
router.get("/myinfor/:user_id", GuardController.getUserById);

/**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Change user password
 *     tags: [Guard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - userId
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/changePassword', GuardController.changePassword);

/**
 * @swagger
 * /changeimg/{user_id}:
 *   post:
 *     summary: Change user image
 *     tags: [Guard]
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
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: User image changed successfully
 *       400:
 *         description: Invalid user ID or image
 *       500:
 *         description: Internal server error
 */
router.post('/changeimg/:user_id', GuardController.changeUserImg);

/**
 * @swagger
 * /changeinfor/{user_id}:
 *   post:
 *     summary: Change user information
 *     tags: [Guard]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: User information changed successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/changeinfor/:user_id', GuardController.changeUserInfo);

/**
 * @swagger
 * /getInfoCustomerbyID/{user_id}:
 *   get:
 *     summary: Get customer information by ID
 *     tags: [Guard]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Customer information retrieved successfully
 *       400:
 *         description: Invalid customer ID
 *       500:
 *         description: Internal server error
 */
router.get('/getInfoCustomerbyID/:user_id', GuardController.getInfoCustomerbyID);

/**
 * @swagger
 * /getDetailBooking/{bookingname}:
 *   get:
 *     summary: Get detailed information of a booking
 *     tags: [Guard]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Detailed booking information retrieved successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *Internal server error
 */
router.get('/getDetailBooking/:bookingname', GuardController.getDetailBooking);

/**
 * @swagger
 * /getDetailBookingOneDay:
 *   get:
 *     summary: Get detailed information of bookings for one day
 *     tags: [Guard]
 *     responses:
 *       200:
 *         description: Detailed booking information retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getDetailBookingOneDay', GuardController.getDetailBookingOneDay);

/**
 * @swagger
 * /getListMyBooking/{user_id}:
 *   get:
 *     summary: Get a list of bookings associated with a user
 *     tags: [Guard]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get('/getListMyBooking/:user_id', GuardController.getListMyBooking);

/**
 * @swagger
 * /getmyBooking/{user_id}:
 *   get:
 *     summary: Get bookings assigned to a user
 *     tags: [Guard]
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
router.get('/getmyBooking/:user_id', GuardController.getmyBooking);

/**
 * @swagger
 * /getmyFeedback/{user_id}:
 *   get:
 *     summary: Get feedbacks received by a user
 *     tags: [Guard]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Feedbacks retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get('/getmyFeedback/:user_id', GuardController.getMyFeedBack);

/**
 * @swagger
 * /getMyNoti/{guard_id}:
 *   get:
 *     summary: Get notifications of a guard
 *     tags: [Guard]
 *     parameters:
 *       - in: path
 *         name: guard_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the guard
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       400:
 *         description: Invalid guard ID
 *       500:
 *         description: Internal server error
 */
router.get('/getMyNoti/:guard_id', GuardController.getMyNoti);
module.exports = router;
