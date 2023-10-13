const db = require('../app.js').db;

const Booking = {
  getAllBookings: () => {
    return db.any('SELECT * FROM booking');
  },

  getBookingById: (id) => {
    return db.one('SELECT * FROM booking WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Booking;