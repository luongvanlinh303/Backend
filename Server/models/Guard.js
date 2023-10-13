const db = require('../app.js').db;

const Guard = {
  getAllGuards: () => {
    return db.any('SELECT * FROM guard');
  },

  getGuardById: (id) => {
    return db.one('SELECT * FROM guard WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Guard;