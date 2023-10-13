const db = require('../app.js').db;

const Customer = {
  getAllCustomers: () => {
    return db.any('SELECT * FROM customer');
  },

  getCustomerById: (id) => {
    return db.one('SELECT * FROM customer WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Customer;