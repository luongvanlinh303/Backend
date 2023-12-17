const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
module.exports = {
    getUserById: async (userId) => {
        const query = 'SELECT * FROM customer WHERE customer_id = $1';
        const values = [userId];
    
        const result = await pool.query(query, values);
        return result.rows[0];
      },
    changeInfo: async (userId , newInfor) => {
    const { firstname, lastname, dob, phone, address,gender } = newInfor;
    try {
      // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
      const updateQuery = {
        text: 'UPDATE customer SET firstname = $1, lastname = $2, dob = $3, phone = $4, address = $5, gender=$6 WHERE customer_id = $7',
        values: [firstname, lastname, dob, phone, address,gender, userId],
      };
      await pool.query(updateQuery);
    
    return 'Customer information updated successfully';
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
    },
    changePassword: async (userId, currentPasswd, newPasswd, confirmNewpasswd) => {
      try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const userQuery = {
          text: 'SELECT passwd FROM users INNER JOIN Customer on Customer.users_id = users.users_id WHERE Customer_id = $1',
          values: [userId],
        };
        const result = await pool.query(userQuery);
        const hashedPassword = result.rows[0].passwd;
    
        // So sánh mật khẩu hiện tại
        const isPasswordMatched = await bcrypt.compare(currentPasswd, hashedPassword);
        if (!isPasswordMatched) {
          throw new Error('Current password is incorrect');
        }
    
        // Hash mật khẩu mới
        const newHashedPassword = await bcrypt.hash(newPasswd, 10);
        const confirmNewHashedPassword = await bcrypt.hash(confirmNewpasswd, 10);
        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        if (newPasswd == confirmNewpasswd){
          const userQuery = {
            text: 'SELECT users.users_id FROM users INNER JOIN Customer on Customer.users_id = users.users_id WHERE Customer_id = $1',
            values: [userId],
          };
          const result = await pool.query(userQuery);
          const resultuser = result.rows[0].users_id;
          const updateQuery = {
          text: 'UPDATE users SET passwd = $1  WHERE users_id = $2',
          values: [newHashedPassword, resultuser],
        };
        await pool.query(updateQuery);
        return 'Password changed successfully';
      }
        else {
          return 'Password confirm different with new password';
        }
        
      } catch (err) {
        console.error('Error:', err);
        throw new Error('An error occurred');
      }
    },
    changeImg: async (userId, imageUrl) => {
      try {
        const updateQuery = {
          text: 'UPDATE customer SET img = $1 WHERE customer_id = $2',
          values: [imageUrl, userId],
        };
        await pool.query(updateQuery);
  
        return 'Customer image updated successfully';
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
        const query = 'SELECT * FROM Guard WHERE guard_id = $1';
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
      const selectuser = {
        text: 'Select firstname, lastname from Customer where customer_id = $1',
        values: [userId],
      };
      const resultCus = await pool.query(selectuser);
      const { firstname, lastname} = resultCus.rows[0];
      const fullName = firstname + ' ' + lastname;
      const type = 'booking';
      const content = 'You created booking with company name ' + companyname + ' success' ;
      const createNotiCus = {
        text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
        
        values: [bookingname1,userId,type, content,booking_date,1],
        };
      await pool.query(createNotiCus);
      const contentManager = 'User '+ fullName + ' created booking with company name ' + companyname + ' success ';
      const createNotiManager = {
        text: 'INSERT INTO notimanager (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
        
        values: [bookingname1,userId,type, contentManager,booking_date,1],
        };
      await pool.query(createNotiManager);
      return 'Customer add to new booking';
      } catch (err) {
        console.error('Error:', err);
        throw new Error('An error occurred');
      }
    },
    getmyBooking: async (userId) => {
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
        console.log(resultbooking.rows);
        const bookings = resultbooking.rows.map(bookingRow => {
          const dataBooking = resultdetail.rows;
          if(resultbookingguard.rows === null){
            return {
              bookingName: bookingRow.bookingname,
              companyname: bookingRow.companyname,
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
            companyname: bookingRow.companyname,
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
            const selectBooking = {
              text: 'Select companyname from booking where bookingname = $1',
              values: [bookingName],
            };
            const resultbooking = await pool.query(selectBooking);

            const selectuser = {
              text: 'Select firstname, lastname from Customer where customer_id = $1',
              values: [customer_id],
            };
            const resultCus = await pool.query(selectuser);
            const { firstname, lastname} = resultCus.rows[0];
            const type = 'attendence';
            const booking_date = new Date();
            const company = resultbooking.rows[0];
            const fullName = firstname + ' ' + lastname;
            const content = 'You attendence with company' + company.companyname + ' success' ;
            const createNotiCus = {
              text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id,time_start,time_end) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING bookingname',
              
              values: [bookingName,customer_id,type, content,booking_date,1,dataBooking.time_start,dataBooking.time_end],
              };
            await pool.query(createNotiCus);
            const contentGuard = 'User '+ fullName + ' attendence you with company name ' + company.companyname + ' success ';
            const createNotiGuard = 'INSERT INTO notiGuard (bookingname,guard_id,customer_id,type,content,publish_date,manager_id,time_start,time_end) VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9) RETURNING bookingname';
              
              const values = [bookingName,guard_id,customer_id,type,contentGuard,booking_date,1,dataBooking.time_start,dataBooking.time_end];
            await pool.query(createNotiGuard, values);
      }
      return "Attendence success";
    }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    Payment: async (bookingname) => {
      try {
    const updatestatus = {
      text: 'Update booking SET status = 2 WHERE bookingname = $1 RETURNING status',
      values: [bookingname],
    };
    await pool.query(updatestatus);
    const selectuser = {
      text: 'Select Customer.firstname, Customer.lastname,Customer.customer_id,booking.companyname from Customer INNER JOIN booking ON Customer.customer_id = booking.customer_id where booking.bookingname = $1',
      values: [bookingname],
    };
    const resultCus = await pool.query(selectuser);
    const { firstname, lastname,customer_id,companyname} = resultCus.rows[0];
    const fullName = firstname + ' ' + lastname;
    const type = 'booking';
    const booking_date = new Date();
    const content = 'You payment booking with company name ' + companyname + ' success' ;
    const createNotiCus = {
      text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
      
      values: [bookingname,customer_id,type, content,booking_date,1],
      };
    await pool.query(createNotiCus);
    const contentManager = 'User '+ fullName + ' payment booking with company name ' + companyname + ' success ';
    const createNotiManager = {
      text: 'INSERT INTO notimanager (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
      
      values: [bookingname,customer_id,type, contentManager,booking_date,1],
      };
    await pool.query(createNotiManager);
    return "Payment success";
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
      
    },
    EditGuardAttendence: async (inforAttendence) => {
      const {bookingName,customer_id ,dataBooking, guard } = inforAttendence;
      try {
        const querydelete = {
          text: 'delete from calendar where bookingname = $1 and time_start = $2 and time_checkin = $3',
          values: [bookingName,dataBooking.time_start, dataBooking.time_end]
        };

        await pool.query(querydelete);
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
          const selectBooking = {
            text: 'Select companyname from booking where bookingname = $1',
            values: [bookingName],
          };
          const resultbooking = await pool.query(selectBooking);

          const selectuser = {
            text: 'Select firstname, lastname from Customer where customer_id = $1',
            values: [customer_id],
          };
          const resultCus = await pool.query(selectuser);
          const { firstname, lastname} = resultCus.rows[0];
          const type = 'attendence';
          const booking_date = new Date();
          const company = resultbooking.rows[0];
          const fullName = firstname + ' ' + lastname;
          const content = 'You edit attendence with company' + company.companyname + ' success' ;
          const createNotiCus = {
            text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id,time_start,time_end) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING bookingname',
            
            values: [bookingName,customer_id,type, content,booking_date,1,dataBooking.time_start,dataBooking.time_end],
            };
          await pool.query(createNotiCus);
          const contentGuard = 'User '+ fullName + ' edit attendence you with company name ' + company.companyname + ' success ';
          const createNotiGuard = 'INSERT INTO notiGuard (bookingname,guard_id,customer_id,type,content,publish_date,manager_id,time_start,time_end) VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9) RETURNING bookingname';
            
            const values = [bookingName,guard_id,customer_id,type,contentGuard,booking_date,1,dataBooking.time_start,dataBooking.time_end];
          await pool.query(createNotiGuard, values);
    }
    return "Edit Attendence success";
      }catch(err) {
        console.error('Lỗi:', err);
        throw err;
      }
    },
    PostFeedBack: async (dataFeedback) => {
      const {bookingname, customer_id,guard_id,rating,comment} = dataFeedback;
      try {
    const Feedback = {
      text: 'INSERT INTO feedback (bookingname,customer_id,guard_id,rating,comment) VALUES ($1, $2, $3,$4,$5) RETURNING bookingname',
      values: [bookingname, customer_id,guard_id,rating,comment],
    };
    await pool.query(Feedback);
    return "Feedback success";
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    GetFeedBack: async()=>{
      try {
        const query = 'SELECT feedback.guard_id, Guard.firstname, Guard.lastname, FLOOR(AVG(feedback.rating)) AS avgrating FROM feedback JOIN Guard ON Guard.guard_id = feedback.guard_id GROUP BY feedback.guard_id, Guard.firstname, Guard.lastname ORDER BY avgrating DESC Limit 3';
        const result = await pool.query(query);
        return result.rows;
      } catch (err) {
        console.error('Error:', err);
        throw err;
      }
    },
    getBookingNotPayment: async (customer_id) => {
      try {
    const query = 'select bookingname,companyname, booking_date, status, total_amount From booking where status = 1 and customer_id = $1';
    const values = [customer_id]
    const result = await pool.query(query,values);
    return result.rows;
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    getBookingPayment: async (customer_id) => {
      try {
    const query = 'select bookingname,companyname, booking_date, status, total_amount From booking where status = 2 and customer_id = $1';
    const values = [customer_id]
    const result = await pool.query(query,values);
    return result.rows;
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    getMyNoti: async(customer_id) => {
      try{
        const query = 'select * From noticus where customer_id = $1 order by noticus_id desc';
        const values = [customer_id]
        const result = await pool.query(query,values);
        return result.rows;
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    CancelBooking: async(bookingname)=>{
      try{
        const DeleteDetail = {
          text: 'Delete From detailbooking where bookingname = $1',
          values: [bookingname],
        };
        await pool.query(DeleteDetail);
        const DeleteCalendar = {
          text: 'Delete From Calendar where bookingname = $1',
          values: [bookingname],
        };
        await pool.query(DeleteCalendar);
        const DeleteBookingGuard = {
          text: 'Delete From BookingGuard where bookingname = $1',
          values: [bookingname],
        };
        await pool.query(DeleteBookingGuard);
        const selectBooking = {
          text: 'Select companyname,customer_id from booking where bookingname = $1',
          values: [bookingname],
        };
        const resultbooking = await pool.query(selectBooking);
        const { customer_id,companyname} = resultbooking.rows[0];
        const selectCustomer = {
          text: 'Select firstname,lastname from customer where customer_id = $1',
          values: [customer_id],
        };
        const resultCustomer = await pool.query(selectCustomer);
        const { firstname,lastname} = resultCustomer.rows[0];
        const fullName = firstname + ' ' + lastname;
        const type = 'cancelbooking';
        const booking_date = new Date();
        const content = 'You canceled booking with company name '+ companyname +' success.';
        const createNotiCus = {
          text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
          
          values: [bookingname,customer_id,type, content,booking_date,1],
          };
        await pool.query(createNotiCus);
        const contentManager = 'User ' +fullName+ ' canceled booking with name '+ companyname +' success';
        const createNotiManager = {
          text: 'INSERT INTO notimanager (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
          
          values: [bookingname,customer_id,type, contentManager,booking_date,1],
          };
        await pool.query(createNotiManager);
        const DeleteBooking = {
          text: 'Delete From Booking where bookingname = $1',
          values: [bookingname],
        };
        await pool.query(DeleteBooking);

        return "Cancel Success";
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
    RequestChangeGuard: async(dataGuard) => {
      const {bookingname, guard_id} = dataGuard;
      try{
        const selectuser = {
          text: 'Select Customer.firstname, Customer.lastname,Customer.customer_id,booking.companyname from Customer INNER JOIN booking ON Customer.customer_id = booking.customer_id where booking.bookingname = $1',
          values: [bookingname],
        };
        const resultCus = await pool.query(selectuser);
        const selectguard = {
          text: 'Select Guard.firstname, Guard.lastname from Guard where guard_id = $1',
          values: [guard_id],
        };
        const resultguard = await pool.query(selectguard);
        const { firstname, lastname,customer_id,companyname} = resultCus.rows[0];
        const fullNameCus = firstname + ' ' + lastname;
        const { firstname: guard_firstname, lastname:guard_lastname} = resultguard.rows[0];
        const fullnameGuard = guard_firstname +' '+guard_lastname;
        const type = 'booking';
        const booking_date = new Date();
        const content = 'You request change guard '+fullnameGuard+' of booking with company name ' + companyname + ' success' ;
        const createNotiCus = {
          text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,guard_id,manager_id) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING bookingname',
          
          values: [bookingname,customer_id,type, content,booking_date,guard_id,1],
          };
        await pool.query(createNotiCus);
        const contentManager = 'User '+ fullNameCus +' request change guard '+fullnameGuard+ ' of booking with company name ' + companyname + ' success ';
        const createNotiManager = {
          text: 'INSERT INTO notimanager (bookingname,customer_id,type,content,publish_date,guard_id,manager_id) VALUES ($1, $2, $3, $4, $5,$6, $7) RETURNING bookingname',
          
          values: [bookingname,customer_id,type, contentManager,booking_date,guard_id,1],
          };
        await pool.query(createNotiManager);
        return "Request Change Success";
      }
      catch(err){
        console.error('Error:', err);
        throw err;
      }
    },
};    