const db = require('../app.js').db;

const Calendar = {
  getAllCalendars: () => {
    return db.any('SELECT * FROM calendar');
  },

  getCalendarById: (id) => {
    return db.one('SELECT * FROM calendar WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Calendar;