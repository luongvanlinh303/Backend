const pool = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

module.exports = {
  getUserById: async (userId) => {
    const query = "SELECT * FROM customer WHERE users_id = $1";
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows[0];
  },
  changeInfo: async (userId, newInfor, imagePath) => {
    const { firstname, lastname, dob, phone, address } = newInfor;
    try {
      // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
      const updateQuery = {
        text: "UPDATE customer SET firstname = $1, lastname = $2, dob = $3, phone = $4, address = $5, img = $6 WHERE users_id = $7",
        values: [firstname, lastname, dob, phone, address, imagePath, userId],
      };
      await pool.query(updateQuery);

      return "Customer information updated successfully";
    } catch (err) {
      console.error("Error:", err);
      throw new Error("An error occurred");
    }
  },
  changeImg: async (userId, imagePath) => {
    try {
      // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
      const updateQuery = {
        text: "UPDATE customer SET img = $1 WHERE users_id = $2",
        values: [imagePath, userId],
      };
      await pool.query(updateQuery);

      return "Customer information updated successfully";
    } catch (err) {
      console.error("Error:", err);
      throw new Error("An error occurred");
    }
  },
  getallGuard: async (req, res) => {
    try {
      const query = "SELECT * FROM Guard";
      const result = await pool.query(query);

      return result.rows;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  },
  getInfoGuardbyID: async (userId) => {
    const query = "SELECT * FROM Guard WHERE users_id = $1";
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  createBooking: async (userId, newBooking) => {
    // Add data to table Booking.
    const { service, address, country, companyname, total_amount, quantity, dataBooking, booking_date } = newBooking;
    const status = 1;
    const bookingname = `${userId + companyname}`;
    try {
      // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
      const createBooking = {
        text: "INSERT INTO booking (bookingname,service,address,country,customer_id,companyname, quantity, booking_date, total_amount, status ) VALUES ($1, $2, $3, $4, $5,$6,$7 ,$8,$9,$10) RETURNING bookingname",
        values: [bookingname, service, address, country, userId, companyname, quantity, booking_date, total_amount, status],
      };
      await pool.query(createBooking);
      // Add Data to table Booking Details
      for (const detaildata of dataBooking) {
        const { time_start, time_end } = detaildata;
        const createDetailBooking = {
          text: "INSERT INTO detailbooking (bookingname,time_start,time_end) VALUES ($1, $2, $3) RETURNING detail_booking_id",
          values: [bookingname, time_start, time_end],
        };
        await pool.query(createDetailBooking);
      }

      return "Customer add to new booking";
    } catch (err) {
      console.error("Error:", err);
      throw new Error("An error occurred");
    }
  },
  getmyBooking: async (userId) => {
    // const query = 'SELECT * FROM booking WHERE customer_id = $1';
    // const querydetail = 'SELECT time_start,time_end FROM detailbooking WHERE bookingname = $1';
    const query =
      "SELECT booking.companyname,detailbooking.time_start,detailbooking.time_end FROM booking INNER JOIN detailbooking ON booking.bookingname = detailbooking.bookingname WHERE customer_id = $1";
    const values = [userId];
    const result = await pool.query(query, values);

    const bookings = result.rows.map((booking1) => {
      return {
        companyname: booking1.companyname,
        time_start: booking1.time_start,
        time_end: booking1.time_end,
      };
    });
    return bookings;
  },
  getDetailBooking: async (bookingname) => {
    try {
      const bookingquery = "SELECT * FROM booking WHERE bookingname = $1";
      const query = "SELECT time_start,time_end FROM detailbooking WHERE bookingname = $1";
      const values = [bookingname];
      const resultbooking = await pool.query(bookingquery, values);
      const result = await pool.query(query, values);
      const bookings = resultbooking.rows.map((bookingRow) => {
        const dataBooking = result.rows;
        return {
          bookingName: bookingRow.bookingname,
          service: bookingRow.service,
          address: bookingRow.address,
          country: bookingRow.country,
          status: bookingRow.status,
          total_amount: bookingRow.total_amount,
          quantity: bookingRow.quantity,
          booking_date: bookingRow.booking_date,
          dataBooking: dataBooking,
        };
      });
      return bookings;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("An error occurred");
    }
  },
};
