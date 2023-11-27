const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
module.exports = {
    getUserById: async (userId) => {
        const query = 'SELECT * FROM customer WHERE users_id = $1';
        const values = [userId];
    
        const result = await pool.query(query, values);
        return result.rows[0];
      },
    changeInfo: async (userId , newInfor) => {
    const { firstname, lastname, dob, phone, address } = newInfor;
    try {
      // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
      const updateQuery = {
        text: 'UPDATE customer SET firstname = $1, lastname = $2, dob = $3, phone = $4, address = $5 WHERE users_id = $6',
        values: [firstname, lastname, dob, phone, address, userId],
      };
      await pool.query(updateQuery);
    
    return 'Customer information updated successfully';
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
    },
    changeImg: async (userId ,imagePath) => {
      try {
        // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
        const updateQuery = {
          text: 'UPDATE customer SET img = $1 WHERE users_id = $2',
          values: [imagePath, userId],
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
      const   {service,address,country,companyname, total_amount, quantity,dataBooking,booking_date } = newBooking ;
      const status = 1;
      const bookingname1 = `${userId + companyname}`;
      try {
        // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
        const createBooking = {
          text: 'INSERT INTO booking (bookingname,service,address,country,customer_id,companyname, quantity, booking_date, total_amount, status ) VALUES ($1, $2, $3, $4, $5,$6,$7 ,$8,$9,$10) RETURNING bookingname',
          values: [bookingname1,service, address, country, userId,companyname , quantity,booking_date, total_amount, status],
        };
        await pool.query(createBooking);
      // Add Data to table Booking Details
      for (const detaildata of dataBooking){
        const {time_start, time_end} = detaildata;
        const createDetailBooking = {
          text: 'INSERT INTO detailbooking (bookingname,time_start,time_end) VALUES ($1, $2, $3) RETURNING detail_booking_id',
          values: [bookingname1,time_start, time_end],
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
      // const query = 'SELECT * FROM booking WHERE customer_id = $1';
      // const querydetail = 'SELECT time_start,time_end FROM detailbooking WHERE bookingname = $1';
      const query ='SELECT booking.companyname,detailbooking.time_start,detailbooking.time_end FROM booking INNER JOIN detailbooking ON booking.bookingname = detailbooking.bookingname WHERE customer_id = $1'
      const values = [userId];
      const result = await pool.query(query, values);

      const bookings = result.rows.map(booking1 => {
        return {
          companyname: booking1.companyname,
          time_start: booking1.time_start,
          time_end: booking1.time_end
        }
        });
        return bookings;

    },
    getDetailBooking: async (bookingname) => {
      try {
        const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
        const query = 'SELECT time_start,time_end FROM detailbooking WHERE bookingname = $1';
        const bookingguard = 'SELECT Bookingguard.guard_id, guard.firstname,guard.lastname from Bookingguard INNER JOIN guard ON Bookingguard.guard_id = guard.guard_id WHERE Bookingguard.bookingname = $1';
        const values = [bookingname];
        const resultbooking = await pool.query(bookingquery, values);
        const resultdetail = await pool.query(query, values);
        const resultbookingguard = await pool.query(bookingguard,values);
        
        const bookings = resultbooking.rows.map(bookingRow => {
          const dataBooking = resultdetail.rows;
          if(resultbookingguard.rows === null){
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
          else{
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
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    getDetailBookingOneDay:async (bookingname,time_start,time_end) => {
      try {
        
        const status = 'SELECT status FROM calendar WHERE bookingname = $1 AND time_start = $2 AND time_checkin = $3'
        const values = [bookingname];
        const valuess = [bookingname,time_start,time_end];
        const datastatus = await pool.query(status,valuess);
        if(datastatus.rows.length === 0)
        {
        const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
        const guarddetail = 'SELECT guard.firstname,guard.lastname,guard.img,guard.guard_id FROM guard INNER JOIN bookingguard ON bookingguard.guard_id = guard.guard_id WHERE bookingguard.bookingname = $1'
        const resultbooking = await pool.query(bookingquery, values);
        const detailguard = await pool.query(guarddetail,values);
          const bookings = resultbooking.rows.map(bookingRow => {
          const dataBooking = {time_start,time_end};
          const detailguards  = detailguard.rows;
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
          const detailguard = await pool.query(guarddetail,valuess);
            const abc = resultbooking.rows.map(bookingRow => {
            const dataBooking = {time_start,time_end};
            const detailguards  = detailguard.rows;
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
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    Attendence: async (inforAttendence) => {
      try {
        
          const { bookingName,customer_id ,dataBooking, guard } = inforAttendence;
    
          for (const guardItem of guard) {
            const { guard_id, status } = guardItem;
    
            // Thực hiện truy vấn INSERT để thêm dữ liệu vào bảng "Calendar"
            const insertQuery = `
              INSERT INTO calendar (bookingname, customer_id,time_start, time_checkin, guard_id, status)
              VALUES ($1, $2, $3, $4, $5,$6)
            `; const calendarValues = [
              bookingName,
              customer_id,
              dataBooking.time_start,
              dataBooking.time_end,
              guard_id,
              status
            ];
            await pool.query(insertQuery, calendarValues);
      }
      return "Attendence success";
    }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
};    