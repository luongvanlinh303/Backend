const db = require('../app.js').db;

const Payment = {
  getAllPayments: () => {
    return db.any('SELECT * FROM payment');
  },

  getPaymentById: (id) => {
    return db.one('SELECT * FROM payment WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Payment;