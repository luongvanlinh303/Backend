const db = require('../app.js').db;

const Manager = {
  getAllManagers: () => {
    return db.any('SELECT * FROM manager');
  },

  getManagerById: (id) => {
    return db.one('SELECT * FROM manager WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Manager;