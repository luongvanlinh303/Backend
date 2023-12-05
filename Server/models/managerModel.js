const pool = require('../config/dbConfig');
module.exports = {
    getallGuard: async (req, res) =>{
        try {
          const query = 'SELECT * FROM Guard ORDER BY status DESC';
          const result = await pool.query(query);
      
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      getallCustomer: async (req, res) =>{
        try {
          const query = 'SELECT * FROM Customer';
          const result = await pool.query(query);
      
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      getAllBooking: async (req, res) => {
        try {
      const query = 'select * From booking ORDER BY status DESC';
      const result = await pool.query(query);
      return result.rows;
        }
        catch(err){
          console.error('Error:', err);
          throw err;
        }
      },
      getDetailBooking: async (bookingname) => {
        try {
          const bookingquery = 'SELECT * FROM booking WHERE bookingname = $1'
          const query = 'SELECT time_start,time_end FROM detailbooking WHERE bookingname = $1';
          const bookingguard = 'SELECT Bookingguard.guard_id, guard.firstname,guard.lastname from Bookingguard INNER JOIN guard ON Bookingguard.guard_id = guard.guard_id WHERE Bookingguard.bookingname = $1';
          const customerinfor = 'SELECT customer.customer_id, customer.firstname,customer.lastname, users.email from Customer INNER JOIN booking ON booking.customer_id = customer.customer_id INNER JOIN users ON users.users_id = customer.users_id WHERE booking.bookingname = $1'
          const values = [bookingname];
          const resultbooking = await pool.query(bookingquery, values);
          const resultdetail = await pool.query(query, values);
          const resultbookingguard = await pool.query(bookingguard,values);
          const resultcustomerinfor = await pool.query(customerinfor,values)
          
          const bookings = resultbooking.rows.map(bookingRow => {
            const customer = resultcustomerinfor.rows;
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
                customer: customer[0],
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
              customer: customer[0],
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
      getBookingPayment: async (req, res) => {
        try {
      const query = 'select * From booking where status = 2';
      const result = await pool.query(query);
      return result.rows;
        }
        catch(err){

        }
      },
      getBookingNotPayment: async (req, res) => {
        try {
      const query = 'select * From booking where status = 1';
      const result = await pool.query(query);
      return result.rows;
        }
        catch(err){
          console.error('Error:', err);
          throw err;
        }
      },
      getBookingDone: async (req, res) => {
        try {
      const query = 'select * From booking where status = 0';
      const result = await pool.query(query);
      return result.rows;
        }
        catch(err){
          console.error('Error:', err);
          throw err;
        }
      },
      PickGuard: async (bookingname, listguard) => {
        try {
          for (let i = 0; i < listguard.length; i++) {
            const value = listguard[i];
            const queryAdd = {
              text: 'INSERT INTO bookingguard (bookingname, guard_id) VALUES ($1, $2)',
              values: [bookingname, value]
            };
            await pool.query(queryAdd);
            const queryupdateguard = {
              text: 'Update guard SET status = 0 where guard_id = $1',
              values: [value]
            };
            await pool.query(queryupdateguard);
            const queryupdatebooking = {
              text: 'Update booking SET status = 0 WHERE bookingname = $1',
              values: [bookingname]
            };
            await pool.query(queryupdatebooking);
          }
          return "Dữ liệu đã được thêm thành công";
        } catch (err) {
          console.error('Lỗi:', err);
          throw err;
        }
      },
      getGuardbyBookingname: async (bookingname) => {
        try {
            const query = 'Select * from bookingguard WHERE bookingname = $1';
            const values = [bookingname];
            const result = await pool.query(query, values);
          return result.rows;
        }catch(err) {
          console.error('Lỗi:', err);
          throw err;
        }
      },
      EditGuardBooking: async (bookingname, listguard) => {
        try {
          const querydelete = {
            text: 'delete from bookingguard where bookingname = $1',
            values: [bookingname]
          };
          await pool.query(querydelete);
            for (let i = 0; i < listguard.length; i++) {
              const value = listguard[i];
              const queryAdd = {
                text: 'INSERT INTO bookingguard (bookingname, guard_id) VALUES ($1, $2)',
                values: [bookingname, value]
              };
              await pool.query(queryAdd);
              const queryupdate = {
                text: 'Update guard SET status = 0 where guard_id = $1',
                values: [value]
              };
              await pool.query(queryupdate);
            }
            return "Dữ liệu đã được thêm thành công";
        }catch(err) {
          console.error('Lỗi:', err);
          throw err;
        }
      },
      GetSalaryGuard: async (guardid) => {
        try {
            const query = 'Select salary from guard WHERE guard_id = $1';
            const values = [guardid];
            const result = await pool.query(query, values);
          return result.rows;
        }catch(err) {
          console.error('Lỗi:', err);
          throw err;
        }
      },
      getListGuardFree: async (guardid) => {
        try {
            const query = 'Select * from guard WHERE status = 1';
            const result = await pool.query(query);
          return result.rows;
        }catch(err) {
          console.error('Lỗi:', err);
          throw err;
        }
      },
      getGuardById: async (userId) => {
        const query = 'SELECT * FROM Guard WHERE guard_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
      getCustomerById: async (userId) => {
        const query = 'SELECT * FROM customer WHERE customer_id = $1';
        const values = [userId];
    
        const result = await pool.query(query, values);
        return result.rows[0];
      },
      postNews: async (news) => {
        const {title, content, publish_date, manager_id} = news;
        try {
          const News = {
            text: 'INSERT INTO news (title, content, publish_date, manager_id) VALUES ($1, $2, $3,$4)',
            values: [title, content, publish_date, manager_id],
          };
          await pool.query(News);
          return "Create News success";
            }
            catch(err){
              console.error('Error:', err);
              throw err;
            }
      },
      getAllNews: async () => {

        try {
          const query = 'SELECT * FROM News';
          const result = await pool.query(query);
      
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
    }; 