const express = require('express');
const multer = require('multer');
const authenticate = require('../middlewares/authenticate');
const customerController = require('../controllers/customerController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: API for user Customer
 */

/**
 * @swagger
 * /customer/myinfor/{user_id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error 
*/
router.get('/myinfor/:user_id', customerController.getUserById);
/**
 * @swagger
 * 
 * /changeimg/{user_id}:
 *   post:
 *     summary: Thay đổi ảnh người dùng theo user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: image
 *         type: file
 *     responses:
 *       200:
 *         description: Ảnh người dùng đã được thay đổi
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/changeimg/:user_id', upload.single('image'), customerController.changeUserImg);

/**
 * @swagger
 * post:
 *     summary: Thay đổi thông tin người dùng theo user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã được thay đổi
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/changeinfor/:user_id', customerController.changeUserInfo);
/**
 * @swagger
* /getAllGuard:
 *   get:
 *     summary: Lấy tất cả các bảo vệ
 *     responses:
 *       200:
 *         description: Danh sách bảo vệ
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.get('/getAllGuard', customerController.getAllGuard);

router.get('/getInfoGuardbyID/:user_id', customerController.getInfoGuardbyID);
router.get('/getmyBooking/:user_id', customerController.getmyBooking);
router.get('/getDetailBooking/:bookingname', customerController.getDetailBooking);
router.get('/getDetailBookingOneDay', customerController.getDetailBookingOneDay);
router.post('/createBooking/:user_id', customerController.createBooking);
router.post('/attendence', customerController.Attendence);
module.exports = router;