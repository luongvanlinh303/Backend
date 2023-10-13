const express = require('express');
const app = express();
const pgp = require('pg-promise')();

// Cấu hình thông số kết nối PostgreSQL
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'your_database_name',
  user: 'your_username',
  password: 'your_password'
};

// Tạo kết nối đến cơ sở dữ liệu PostgreSQL
const db = pgp(dbConfig);

// ... Tiếp tục viết code ứng dụng Express của bạn ...

// Một ví dụ đơn giản: Lấy tất cả các bản ghi từ một bảng
app.get('/api/data', (req, res) => {
  db.any('SELECT * FROM your_table_name')
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// ... Tiếp tục viết code ứng dụng Express của bạn ...

// Khởi chạy server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});