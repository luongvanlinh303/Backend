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
        catch(err){date
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
            const selectBooking = {
              text: 'Select companyname,customer_id from booking where bookingname = $1',
              values: [bookingname],
            };
            const resultbooking = await pool.query(selectBooking);
            const selectGuard = {
              text: 'Select firstname,lastname from Guard where Guard_id = $1',
              values: [value],
            };
            const resultGuard = await pool.query(selectGuard);
            const { firstname,lastname} = resultGuard.rows[0];
            const fullName = firstname + ' ' + lastname;
            const { customer_id,companyname} = resultbooking.rows[0];
            const type = 'booking';
            const booking_date = new Date();
            const content = 'Admin added full Guard for your booking with company name ' + companyname + ' success ';
            const createNotiCus = {
              text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
              
              values: [bookingname,customer_id,type, content,booking_date,1],
              };
            await pool.query(createNotiCus);
            const contentManager = 'You added Guard with name '+fullName+' for booking with company name ' + companyname + ' success ';
            const createNotiManager = {
              text: 'INSERT INTO notimanager (bookingname,customer_id,type,guard_id,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING bookingname',
              
              values: [bookingname,customer_id,type,value, contentManager,booking_date,1],
              };
            await pool.query(createNotiManager);
            const contentGuard = 'You added by Admin for booking with company name ' + companyname + ' success ';
            const createNotiGuard = {
              text: 'INSERT INTO notiGuard (bookingname,guard_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
              
              values: [bookingname,value,type, contentGuard,booking_date,1],
              };
            await pool.query(createNotiGuard);
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
          const getGuardIdsQuery = {
            text: 'SELECT guard_id FROM bookingguard WHERE bookingname = $1',
            values: [bookingname],
          };
          const result =  await pool.query(getGuardIdsQuery);
          const guardIds = result.rows.map((row) => row.guard_id);
          const updateGuardQuery = {
            text: 'UPDATE guard SET status = 1 WHERE guard_id = ANY($1)',
            values: [ guardIds],
          };
          await pool.query(updateGuardQuery);
          for (let i = 0; i < listguard.length; i++) {
            const value = guardIds[i];
          
          const selectBooking = {
            text: 'Select companyname,customer_id from booking where bookingname = $1',
            values: [bookingname],
          };
          const resultbooking = await pool.query(selectBooking);
          const selectGuard = {
            text: 'Select firstname,lastname from Guard where Guard_id = ANY($1)',
            values: [guardIds],
          };
          const resultGuard = await pool.query(selectGuard);
          const { firstname,lastname} = resultGuard.rows[0];
          const fullName = firstname + ' ' + lastname;
          const { customer_id,companyname} = resultbooking.rows[0];
          const type = 'booking';
          const booking_date = new Date();
          const content = 'Admin deleted Guard' +fullName+ ' for your booking with company name ' + companyname + ' success ';
          const createNotiCus = {
            text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
            
            values: [bookingname,customer_id,type, content,booking_date,1],
            };
          await pool.query(createNotiCus);
          const contentManager = 'You deleted Guard with name '+fullName+' for booking with company name ' + companyname + ' success ';
          const createNotiManager = {
            text: 'INSERT INTO notimanager (bookingname,customer_id,type,guard_id,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING bookingname',
            
            values: [bookingname,customer_id,type,value, contentManager,booking_date,1],
            };
          await pool.query(createNotiManager);
          const contentGuard = 'You deleted by Admin for booking with company name ' + companyname + ' success ';
          const createNotiGuard = {
            text: 'INSERT INTO notiGuard (bookingname,guard_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
            
            values: [bookingname,value,type, contentGuard,booking_date,1],
            };
          await pool.query(createNotiGuard);
        }
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
              const selectBooking = {
                text: 'Select companyname,customer_id from booking where bookingname = $1',
                values: [bookingname],
              };
              const resultbooking = await pool.query(selectBooking);
              const selectGuard = {
                text: 'Select firstname,lastname from Guard where Guard_id = ANY($1)',
                values: [guardIds],
              };
              const resultGuard = await pool.query(selectGuard);
              const { firstname,lastname} = resultGuard.rows[0];
              const fullName = firstname + ' ' + lastname;
              const { customer_id,companyname} = resultbooking.rows[0];
              const type = 'booking';
              const booking_date = new Date();
              const content = 'Admin added full Guard for your booking with company name ' + companyname + ' success ';
              const createNotiCus = {
                text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
                
                values: [bookingname,customer_id,type, content,booking_date,1],
                };
              await pool.query(createNotiCus);
              const contentManager = 'You added Guard with name '+fullName+' for booking with company name ' + companyname + ' success ';
              const createNotiManager = {
                text: 'INSERT INTO notimanager (bookingname,customer_id,type,guard_id,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING bookingname',
                
                values: [bookingname,customer_id,type,value, contentManager,booking_date,1],
                };
              await pool.query(createNotiManager);
              const contentGuard = 'You added by Admin for booking with company name ' + companyname + ' success ';
              const createNotiGuard = {
                text: 'INSERT INTO notiGuard (bookingname,guard_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
                
                values: [bookingname,value,type, contentGuard,booking_date,1],
                };
              await pool.query(createNotiGuard);
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
          const query = 'SELECT * FROM News ORDER By id DESC';
          const result = await pool.query(query);
      
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      editNews: async (news) => {
        const {id,title, content, publish_date, manager_id} = news;
        try {
          // Cập nhật thông tin người giữ cửa vào cơ sở dữ liệu
          const updateQuery = {
            text: 'UPDATE news SET title = $1, content = $2, publish_date = $3, manager_id = $4 WHERE id = $5',
            values: [title, content, publish_date, manager_id, id],
          };
          await pool.query(updateQuery);
        
        return 'News updated successfully';
        } catch (err) {
          console.error('Error:', err);
          throw new Error('An error occurred');
        }
      },
      getTop4News: async () => {

        try {
          const query = 'SELECT * FROM News ORDER By id DESC LIMIT 4';
          const result = await pool.query(query);
      
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      getDetailNews: async (news_id) => {

        try {
          const query = 'SELECT * FROM News WHERE id = $1';
          const values = [news_id];
          const result = await pool.query(query,values);
      
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      deleteNews: async (news_id) => {
        try {
          const deleteQuery = {
            text: 'Delete from news WHERE id = $1',
            values: [news_id],
          };
          await pool.query(deleteQuery);
        
        return 'News deleted successfully';
        } catch (err) {
          console.error('Error:', err);
          throw new Error('An error occurred');
        }
      },
      summary: async () => {
        try {
          const queryCustomer = 'SELECT COUNT(*) FROM Customer';
          const queryGuard = 'SELECT COUNT(*) FROM Guard';
          const queryBooking = 'SELECT SUM(total_amount) , COUNT(bookingName)  FROM Booking';
          const querySalary = 'SELECT SUM(salary) FROM Guard'
          const resultCustomer = await pool.query(queryCustomer);
          const resultGuard = await pool.query(queryGuard);
          const resultBooking = await pool.query(queryBooking);
          const resultSalary = await pool.query(querySalary);
          const statistics = [{
            totalCustomer: resultCustomer.rows[0].count,
            totalGuard: resultGuard.rows[0].count,
            total_booking: resultBooking.rows[0].count,
            total_amount: resultBooking.rows[0].sum,
            total_salary: resultSalary.rows[0].sum,
            total_profit:resultBooking.rows[0].sum - resultSalary.rows[0].sum
          }
          ];
          return statistics;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      SearchGuard: async (query) => {
        const searchQuery  = `SELECT * FROM Guard WHERE firstname ILIKE $1 OR lastname ILIKE $1 OR address ILIKE $1`;
        const searchValue = [`%${query}%`];
        try {
          const result = await pool.query(searchQuery, searchValue);
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      SearchCustomer: async (query) => {
        const searchQuery  = `SELECT * FROM Customer WHERE firstname ILIKE $1 OR lastname ILIKE $1`;
        const searchValue = [`%${query}%`];
        try {
          const result = await pool.query(searchQuery, searchValue);
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      filterByStatus:  async (status) => {
        const searchQuery = `
          SELECT *
          FROM Guard
          WHERE status = $1
        `;
        const searchValue = [status];
        try {
          const result = await pool.query(searchQuery, searchValue);
          return result.rows;
        } catch (err) {
          console.error('Error:', err);
          throw err;
        }
      },
      getMyNoti: async() => {
        try{
          const query = 'select * From notimanager order by noticus_id desc';
          const result = await pool.query(query);
          return result.rows;
        }
        catch(err){
          console.error('Error:', err);
          throw err;
        }
      },
      postEnoughGuard: async(bookingname) => {
        try{
          const updatestatus = {
            text: 'Update booking SET status = 4 WHERE bookingname = $1 RETURNING status',
            values: [bookingname],
          };
          await pool.query(updatestatus);
          const selectBooking = {
            text: 'Select companyname,customer_id from booking where bookingname = $1',
            values: [bookingname],
          };
          const resultbooking = await pool.query(selectBooking);
              const { customer_id,companyname} = resultbooking.rows[0];
              const type = 'booking';
              const booking_date = new Date();
              const content = 'Currently, the number of Guards is not enough to allocate to booking '+ companyname +' You can wait or cancel the booking.';
              const createNotiCus = {
                text: 'INSERT INTO notiCus (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
                
                values: [bookingname,customer_id,type, content,booking_date,1],
                };
              await pool.query(createNotiCus);
              const contentManager = 'You send request cancel booking'+ companyname +' success';
              const createNotiManager = {
                text: 'INSERT INTO notimanager (bookingname,customer_id,type,content,publish_date,manager_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING bookingname',
                
                values: [bookingname,customer_id,type, contentManager,booking_date,1],
                };
              await pool.query(createNotiManager);
          return "Send Customer Enough Guard success";
        }
        catch(err){
          console.error('Error:', err);
          throw err;
        }
      },
    }; 