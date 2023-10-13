const db = require('../app.js').db;

const News = {
    getAllNews: () => {
      return db.any('SELECT * FROM news');
    },
  
    getNewsById: (id) => {
      return db.one('SELECT * FROM news WHERE id = $1', [id]);
    },
  
    // Thêm các phương thức truy vấn khác tại đây
  };
  
  module.exports = News;