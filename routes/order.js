/**
 * Created by CTT VNPAY
 */

let express = require('express');
let router = express.Router();
const Customer = require('../models/customerModel');
const request = require('request');
const moment = require('moment');

router.post('/create_payment_url', function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = '3AJ5FXBB';
  let secretKey = 'GSMYNKXFMYYUDFUCHAVBEJXXLIQZZUED';
  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  let returnUrl = 'http://localhost:3001/customer-unpaid-list';
  let orderId = moment(date).format('DDHHmmss');
  let amount = req.body.amount;
  let bookingname = req.body.bookingname;

  let bankCode = 'VNBANK';

  let locale = 'vn';
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = bookingname;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.send(vnpUrl);
});

router.get('/vnpay_ipn', function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];
  const bookingname = vnp_Params['vnp_OrderInfo'];

  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  let secretKey = 'GSMYNKXFMYYUDFUCHAVBEJXXLIQZZUED';
  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.

  if (paymentStatus == '0') {
    //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
    res.status(200).json({ RspCode: '00', Message: 'Success' });
    if (rspCode == '00') {
      Customer.Payment(bookingname);
    } else {
      //that bai
      //paymentStatus = '2'
      // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
      res.redirect('http://localhost:3001/customer-unpaid-list');
    }
  } else {
    res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = router;
