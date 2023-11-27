const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    getUserById: async (userId) => {
        const query = 'SELECT * FROM guard WHERE users_id = $1';
        const values = [userId];
    
        const result = await pool.query(query, values);
        return result.rows[0];
      },
    changeInfo: async (userId , newInfor) => {
      const { firstname, lastname, dob, phone, address } = newInfor;
      try {
        // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
        const updateQuery = {
          text: 'UPDATE guard SET firstname = $1, lastname = $2, dob = $3, phone = $4, address = $5 WHERE users_id = $6',
          values: [firstname, lastname, dob, phone, address, userId],
        };
        await pool.query(updateQuery);
      
      return 'Guard information updated successfully';
      } catch (err) {
        console.error('Error:', err);
        throw new Error('An error occurred');
      }
     },
     changeImg: async (userId ,imagePath) => {
      try {
        // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
        const updateQuery = {
          text: 'UPDATE guard SET img = $1 WHERE users_id = $2',
          values: [imagePath, userId],
        };
        await pool.query(updateQuery);
      
      return 'Guard information updated successfully';
      } catch (err) {
        console.error('Error:', err);
        throw new Error('An error occurred');
      }
     },
     getInfoCustomerbyID: async (userId) => {
      const query = 'SELECT * FROM customer WHERE users_id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows[0];
  },
};    