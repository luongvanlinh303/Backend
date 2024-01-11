const express = require('express');
const managerController = require('../controllers/managerController');
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Manager
 *   description: Manager endpoints
 */

/**
 * @swagger
 * /listGuard:
 *   get:
 *     summary: Get a list of guards
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: List of guards retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/listGuard', managerController.getListGuard);

/**
 * @swagger
 * /listGuardFree:
 *   get:
 *     summary: Get a list of free guards
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: List of free guards retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/listGuardFree', managerController.getListGuardFree);

/**
 * @swagger
 * /listCustomer:
 *   get:
 *     summary: Get a list of customers
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/listCustomer', managerController.getListCustomer);

/**
 * @swagger
 * /getAllBooking:
 *   get:
 *     summary: Get all bookings
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getAllBooking', managerController.getAllBooking);

/**
 * @swagger
 * /getDetailBooking/{bookingname}:
 *   get:
 *     summary: Get detailed information of a booking
 *     tags: [Manager]
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
 *         description: Internal server error
 */
router.get('/getDetailBooking/:bookingname', managerController.getDetailBooking);

/**
 * @swagger
 * /getBookingPayment:
 *   get:
 *     summary: Get bookings with payment status
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Bookings with payment status retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getBookingPayment', managerController.getBookingPayment);

/**
 * @swagger
 * /getBookingNotPayment:
 *   get:
 *     summary: Get bookings without payment status
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Bookings without payment status retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getBookingNotPayment', managerController.getBookingNotPayment);

/**
 * @swagger
 * /getBookingDone:
 *   get:
 *     summary: Get completed bookings
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Completed bookings retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getBookingDone', managerController.getBookingDone);

/**
 * @swagger
 * /getGuardbyBookingname/{bookingname}:
 *   get:
 *     summary: Get the guard assigned to a booking
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Guard assigned to the booking retrieved successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *         description: Internal server error
 */
router.get('/getGuardbyBookingname/:bookingname', managerController.getGuardbyBookingname);

/**
 * @swagger
 * /GetSalaryGuard/{guard_id}:
 *   get:
 *     summary: Get the salary of a guard
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: guard_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the guard
 *     responses:
 *       200:
 *         description: Salary of the guard retrieved successfully
 *       400:
 *         description: Invalid guard ID
 *       500:
 *         description: Internal server error
 */
router.get('/GetSalaryGuard/:guard_id', managerController.GetSalaryGuard);

/**
 * @swagger
 * /getCustomerById/{customer_id}:
 *   get:
 *     summary: Get customer information by ID
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: customer_id
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
router.get('/getCustomerById/:customer_id', managerController.getCustomerById);

/**
 * @swagger
 * /getGuardById/{guard_id}:
 *   get:
 *     summary: Get guard information by ID
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: guard_id
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
router.get('/getGuardById/:guard_id', managerController.getGuardById);

/**
 * @swagger
 * /getAllNews:
 *   get:
 *     summary: Get all news
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: All news retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getAllNews', managerController.getAllNews);
/**
 * @swagger
 * /getTop4News:
 *   get:
 *     summary: Get top 4 news
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Top 4 news retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getTop4News', managerController.getTop4News);

/**
 * @swagger
 * /getDetailNews/{news_id}:
 *   get:
 *     summary: Get detailed information of a news article
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: news_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the news article
 *     responses:
 *       200:
 *         description: Detailed news information retrieved successfully
 *       400:
 *         description: Invalid news ID
 *       500:
 *         description: Internal server error
 */
router.get('/getDetailNews/:news_id', managerController.getDetailNews);

/**
 * @swagger
 * /PickGuard/{bookingname}:
 *   post:
 *     summary: Pick a guard for a booking
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Guard picked successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *         description: Internal server error
 */
router.post('/PickGuard/:bookingname', managerController.PickGuard);

/**
 * @swagger
 * /postEnoughGuard/{bookingname}:
 *   post:
 *     summary: Notify that enough guards are available for a booking
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Notification posted successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *         description: Internal server error
 */
router.post('/postEnoughGuard/:bookingname', managerController.postEnoughGuard);

/**
 * @swagger
 * /EditGuardBooking/{bookingname}:
 *   post:
 *     summary: Edit the assigned guard for a booking
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the booking
 *     responses:
 *       200:
 *         description: Assigned guard for the booking edited successfully
 *       400:
 *         description: Invalid booking name
 *       500:
 *         description: Internal server error
 */
router.post('/EditGuardBooking/:bookingname', managerController.EditGuardBooking);

/**
 * @swagger
 * /postNews:
 *   post:
 *     summary: Create a new news article
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: News article created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/postNews', managerController.postNews);

/**
 * @swagger
 * /editNews:
 *   post:
 *     summary: Edit a news article
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: News article edited successfully
 *       500:
 *         description: Internal server error
 */
router.post('/editNews', managerController.editNews);

/**
 * @swagger
 * /deleteNews/{news_id}:
 *   post:
 *     summary: Delete a news article
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: news_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the news article
 *     responses:
 *       200:
 *         description: News article deleted successfully
 *      ```javascript
/**
 * @swagger
 * /deleteNews/{news_id}:
 *   post:
 *     summary: Delete a news article
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: news_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the news article
 *     responses:
 *       200:
 *         description: News article deleted successfully
 *       400:
 *         description: Invalid news ID
 *       500:
 *         description: Internal server error
 */
router.post('/deleteNews/:news_id', managerController.deleteNews);

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/summary', managerController.summary);

/**
 * @swagger
 * /searchGuard:
 *   get:
 *     summary: Search for guards
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Guards retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/searchGuard', managerController.SearchGuard);

/**
 * @swagger
 * /searchCustomer:
 *   get:
 *     summary: Search for customers
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/searchCustomer', managerController.SearchCustomer);

/**
 * @swagger
 * /filterByStatus:
 *   get:
 *     summary: Filter bookings by status
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Bookings filtered successfully
 *       500:
 *         description: Internal server error
 */
router.get('/filterByStatus', managerController.filterByStatus);

/**
 * @swagger
 * /getMyNoti:
 *   get:
 *     summary: Get notifications for the manager
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getMyNoti', managerController.getMyNoti);
/**
 * @swagger
 * /getCountAttendance/{bookingname}:
 *   post:
 *     summary: getCountAttendance
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: bookingname
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the news article
 *     responses:
 *       200:
 *         description: News article deleted successfully
 *       400:
 *         description: Invalid news ID
 *       500:
 *         description: Internal server error
 */
router.get('/getCountAttendance/:bookingname', managerController.getCountAttendance);
module.exports = router;