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
      // Add data to table Booking.
      const   { bookingname,service,address,country, total_amount, quantity,dataBooking,booking_date } = newBooking ;
      const status = "Not yet Payment"
      try {
        // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
        const createBooking = {
          text: 'INSERT INTO booking (bookingname,service,address,country,customer_id, quantity, booking_date, total_amount, status ) VALUES ($1, $2, $3, $4, $5,$6,$7 ,$8,$9) RETURNING bookingname',
          values: [bookingname,service, address, country, userId , quantity,booking_date, total_amount, status],
        };
        await pool.query(createBooking);
      // Add Data to table Booking Details
      const bookingName = newBooking.bookingname;
      for (const detaildata of dataBooking){
        const {time_start, time_end} = detaildata;
        const createDetailBooking = {
          text: 'INSERT INTO detailbooking (bookingname,time_start,time_end) VALUES ($1, $2, $3) RETURNING detail_booking_id',
          values: [bookingName,time_start, time_end],
          };
        await pool.query(createDetailBooking);
      }
      
      return 'Customer add to new booking';
      } catch (err) {
        console.error('Error:', err);
        throw new Error('An error occurred');
      }
    },
    getmyBooking: async (userId) => {
      const query = 'SELECT * FROM booking WHERE customer_id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows;
    },
};    