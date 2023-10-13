const db = require('../app.js').db;

const Feedback = {
  getAllFeedbacks: () => {
    return db.any('SELECT * FROM feedback');
  },

  getFeedbackById: (id) => {
    return db.one('SELECT * FROM feedback WHERE id = $1', [id]);
  },

  // Thêm các phương thức truy vấn khác tại đây
};

module.exports = Feedback;