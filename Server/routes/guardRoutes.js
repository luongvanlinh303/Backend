const express = require("express");
const multer = require('multer');
const authenticate = require("../middlewares/authenticate");
const GuardController = require("../controllers/guardController");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.get("/myinfor/:user_id", authenticate, GuardController.getUserById);
// router.get('/myinfor/:user_id', GuardController.getUserById);
router.post('/changeimg/:user_id', upload.single('image'), GuardController.changeUserImg);
router.post('/changeinfor/:user_id', GuardController.changeUserInfo);
router.get('/getInfoCustomerbyID/:user_id', GuardController.getInfoCustomerbyID);
module.exports = router;
