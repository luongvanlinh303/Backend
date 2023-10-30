const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    getUserById: async (userId) => {
        const query = 'SELECT * FROM customer WHERE users_id = $1';
        const values = [userId];
    
        const result = await pool.query(query, values);
        return result.rows[0];
      },
    changeInfo: async (userId , newInfor) => {
    const { firstname, lastname, age, phone, address, img } = newInfor;
    try {
      // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
      const updateQuery = {
        text: 'UPDATE customer SET firstname = $1, lastname = $2, age = $3, phone = $4, address = $5, img = $6 WHERE users_id = $7',
        values: [firstname, lastname, age, phone, address, img, userId],
      };
      await pool.query(updateQuery);
    
    return 'Customer information updated successfully';
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
    },
    getallGuard: async (req, res) =>{
      try {
        const query = 'SELECT * FROM Guard';
        const result = await pool.query(query);
    
        return result.rows;
      } catch (err) {
        console.error('Error:', err);
        throw err;
      }
    },
    getInfoGuardbyID: async (userId) => {
        const query = 'SELECT * FROM Guard WHERE users_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    createBooking: async (userId , newBooking) => {
      const   { timestart, timeend, quantity, booking_date, total_amount, status } = newBooking ;
      const rolemanager = 1;
      try {
        // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
        const createBooking = {
          text: 'INSERT INTO Booking (time_start, time_end, quantity, booking_date, manager_id, total_amount, status ,customer_id) VALUES ($1, $2, $3, $4, $5,$6,$7 ,$8) RETURNING customer_id',
          values: [timestart, timeend, quantity, booking_date , rolemanager, total_amount, status, userId],
        };
        await pool.query(createBooking);
      
      return 'Customer add to new booking';
      } catch (err) {
        console.error('Error:', err);
        throw new Error('An error occurred');
      }
    },
    getmyBooking: async (userId) => {
      const query = 'SELECT * FROM Booking WHERE customer_id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows;
    },
};    