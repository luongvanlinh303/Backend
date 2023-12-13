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
  changeInfo: async (userId, newInfor) => {
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
  changeImg: async (userId, imagePath) => {
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
  getDetailBooking: async (bookingname) => {
    try {
      const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
      const query = 'SELECT time_start,time_end,staus FROM detailbooking INNER JOIN calendar ON calendar.bookingname =detailbooking.bookingname AND calendar.time_start =detailbooking.time_start AND calendar.time_checkin =detailbooking.time_end  WHERE bookingname = $1';
      const bookingguard = 'SELECT Bookingguard.guard_id, guard.firstname,guard.lastname from Bookingguard INNER JOIN guard ON Bookingguard.guard_id = guard.guard_id WHERE Bookingguard.bookingname = $1';
      const values = [bookingname];
      const resultbooking = await pool.query(bookingquery, values);
      const resultdetail = await pool.query(query, values);
      const resultbookingguard = await pool.query(bookingguard, values);

      const bookings = resultbooking.rows.map(bookingRow => {
        const dataBooking = resultdetail.rows;
        if (resultbookingguard.rows === null) {
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
            guard: "Manager chưa phân bổ Guard",
          };
        }
        else {
          const guards = resultbookingguard.rows;
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
            guard: guards,
          };
        }

      });
      return bookings;
    }
    catch (err) {
      console.error('Error:', err);
      throw err;
    }
  },
  getDetailBookingOneDay: async (bookingname, time_start, time_end) => {
    try {

      const status = 'SELECT status FROM calendar WHERE bookingname = $1 AND time_start = $2 AND time_checkin = $3'
      const values = [bookingname];
      const valuess = [bookingname, time_start, time_end];
      const datastatus = await pool.query(status, valuess);
      if (datastatus.rows.length === 0) {
        const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
        const guarddetail = 'SELECT guard.firstname,guard.lastname,guard.img,guard.guard_id FROM guard INNER JOIN bookingguard ON bookingguard.guard_id = guard.guard_id WHERE bookingguard.bookingname = $1'
        const resultbooking = await pool.query(bookingquery, values);
        const detailguard = await pool.query(guarddetail, values);
        const bookings = resultbooking.rows.map(bookingRow => {
          const dataBooking = { time_start, time_end };
          const detailguards = detailguard.rows;
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
            guard: detailguards,
          };
        });
        bookings[0].guard.forEach(guard => {
          guard.status = null;
        });
        return bookings;
      }
      else {
        const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
        const guarddetail = 'SELECT guard.firstname,guard.lastname,guard.img, guard.guard_id, calendar.status FROM guard INNER JOIN calendar ON calendar.guard_id = guard.guard_id INNER JOIN bookingguard ON bookingguard.guard_id = guard.guard_id WHERE bookingguard.bookingname = $1 AND calendar.time_start = $2 AND calendar.time_checkin = $3'
        const resultbooking = await pool.query(bookingquery, values);
        const detailguard = await pool.query(guarddetail, valuess);
        const abc = resultbooking.rows.map(bookingRow => {
          const dataBooking = { time_start, time_end };
          const detailguards = detailguard.rows;
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
            guard: detailguards,
          };
        });
        return abc;
      }


    }
    catch (err) {
      console.error('Error:', err);
      throw err;
    }
  },
  //   getListMyBooking: async (guard_id) => {
  //     try {
  //     const query = 'SELECT bookingname FROM bookingguard WHERE guard_id = $1';
  //     const values = [guard_id];
  //     const result = await pool.query(query, values);
  //     const bookings = result.rows.map(booking => booking.bookingname);
  //     for (const booking of bookings){
  //       const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
  //       const query = 'SELECT time_start,time_end FROM detailbooking WHERE bookingname = $1';
  //       const bookingguard = 'SELECT Bookingguard.guard_id, guard.firstname,guard.lastname from Bookingguard INNER JOIN guard ON Bookingguard.guard_id = guard.guard_id WHERE Bookingguard.bookingname = $1';
  //       const values = [bookings];
  //       const resultbooking = await pool.query(bookingquery, values);
  //       const resultdetail = await pool.query(query, values);
  //       const resultbookingguard = await pool.query(bookingguard,values);

  //       const bookingss = resultbooking.rows.map(bookingRow => {
  //         const dataBooking = resultdetail.rows;
  //         if(resultbookingguard.rows === null){
  //           return {
  //             bookingName: bookingRow.bookingname,
  //             service: bookingRow.service,
  //             address: bookingRow.address,
  //             country: bookingRow.country,
  //             status: bookingRow.status,
  //             total_amount: bookingRow.total_amount,
  //             quantity: bookingRow.quantity,
  //             booking_date: bookingRow.booking_date,
  //             dataBooking: dataBooking,
  //             guard: "Manager chưa phân bổ Guard",
  //           };
  //         }
  //         else{
  //           const guards = resultbookingguard.rows;
  //           return {
  //           bookingName: bookingRow.bookingname,
  //           service: bookingRow.service,
  //           address: bookingRow.address,
  //           country: bookingRow.country,
  //           status: bookingRow.status,
  //           total_amount: bookingRow.total_amount,
  //           quantity: bookingRow.quantity,
  //           booking_date: bookingRow.booking_date,
  //           dataBooking: dataBooking,
  //           guard: guards,
  //         };
  //         }

  //       });
  //       return bookingss;
  //     }

  //   }catch (err) {
  //     console.error('Error:', err);
  //     throw new Error('An error occurred');
  //   }
  // },
  getListMyBooking: async (guard_id) => {
    try {
      const query = 'SELECT bookingname FROM bookingguard WHERE guard_id = $1';
      const values = [guard_id];
      const result = await pool.query(query, values);
      const bookings = result.rows.map(booking => booking.bookingname);
      const allBookings = [];

      for (const bookingName of bookings) {
        const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1';
        const query = 'SELECT time_start, time_end FROM detailbooking WHERE bookingname = $1';
        const bookingguard = 'SELECT Bookingguard.guard_id, guard.firstname, guard.lastname FROM Bookingguard INNER JOIN guard ON Bookingguard.guard_id = guard.guard_id WHERE Bookingguard.bookingname = $1';
        const values = [bookingName];
        const resultbooking = await pool.query(bookingquery, values);
        const resultdetail = await pool.query(query, values);
        const resultbookingguard = await pool.query(bookingguard, values);

        const bookingss = resultbooking.rows.map(bookingRow => {
          const dataBooking = resultdetail.rows;
          if (resultbookingguard.rows === null) {
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
              guard: "Manager chưa phân bổ Guard",
            };
          } else {
            const guards = resultbookingguard.rows;
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
              guard: guards,
            };
          }
        });

        allBookings.push(...bookingss);
      }

      return allBookings;
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
  },
  getmyBooking: async (userId) => {
    const query = 'SELECT booking.bookingname,booking.companyname,booking.customer_id,detailbooking.time_start,detailbooking.time_end FROM booking INNER JOIN detailbooking ON booking.bookingname = detailbooking.bookingname INNER JOIN bookingguard ON detailbooking.bookingname = bookingguard.bookingname  WHERE bookingguard.guard_id = $1'
    // const query = 'SELECT booking.companyname,booking.customer_id,detailbooking.time_start,detailbooking.time_end,calendar.status FROM booking INNER JOIN detailbooking ON booking.bookingname = detailbooking.bookingname INNER JOIN bookingguard ON detailbooking.bookingname = bookingguard.bookingname INNER JOIN calendar ON bookingguard.bookingname = calendar.bookingname WHERE bookingguard.guard_id = $1'
    const values = [userId];
    const result = await pool.query(query, values);

    const bookings = result.rows.map(booking1 => {
      return {
        
        companyname: booking1.companyname,
        customer_id: booking1.customer_id,
        time_start: booking1.time_start,
        time_end: booking1.time_end,
        bookingname: booking1.bookingname,
        status: null
      }
    });
    const booking = bookings[0].bookingname;
    console.log(booking);
    const query1 = 'SELECT calendar.status FROM detailbooking INNER JOIN calendar ON calendar.bookingname =detailbooking.bookingname AND calendar.time_start =detailbooking.time_start AND calendar.time_checkin = detailbooking.time_end  WHERE detailbooking.bookingname = $1 AND calendar.guard_id = $2';
    const valuess = [booking,userId];
    const result1 = await pool.query(query1, valuess);
    result1.rows.forEach((row, index) => {
      bookings[index].status = row.status;
    });
    return bookings;

  },
  getMyFeedBack:async (userId) => {
    const query = 'SELECT * FROM feedback WHERE guard_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  },
  getMyNoti: async(guard_id) => {
    try{
      const query = 'select * From notiguard where guard_id = $1 order by noticus_id desc';
      const values = [guard_id]
      const result = await pool.query(query,values);
      return result.rows;
    }
    catch(err){
      console.error('Error:', err);
      throw err;
    }
  },
};    