const Manager = require('../models/managerModel');
module.exports = {
    getListGuard: async (req, res) => {
        try {
            const result = await Manager.getallGuard();
            return res.status(200).json(result);
          } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'An error occurred' });
          } 
      },
    getListCustomer: async (req, res) => {
      try {
          const result = await Manager.getallCustomer();
          return res.status(200).json(result);
        } catch (err) {
          console.error('Error:', err);
          return res.status(500).json({ message: 'An error occurred' });
        } 
    },
    getAllBooking: async (req, res) => {
      try {
          const result = await Manager.getAllBooking();
          return res.status(200).json(result);
        } catch (err) {
          console.error('Error:', err);
          return res.status(500).json({ message: 'An error occurred' });
        } 
    },
    getDetailBooking: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const result = await Manager.getDetailBooking(bookingname);
        return res.status(200).json(result[0]);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingPayment: async (req, res) => {
      try {
        const result = await Manager.getBookingPayment();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingNotPayment: async (req, res) => {
      try {
        const result = await Manager.getBookingNotPayment();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingDone: async (req, res) => {
      try {
        const result = await Manager.getBookingDone();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    PickGuard: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const listguard = req.body.listguard;
        const result = await Manager.PickGuard(bookingname, listguard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getGuardbyBookingname: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const result = await Manager.getGuardbyBookingname(bookingname);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    EditGuardBooking: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const listguard = req.body.listguard;
        const result = await Manager.EditGuardBooking(bookingname, listguard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    DeleteAccount: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const listguard = req.body.listguard;
        const result = await Manager.DeleteAccount(bookingname, listguard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    GetSalaryGuard: async (req, res) => {
      try {
        const guardid = req.params.guard_id;
        const result = await Manager.GetSalaryGuard(guardid);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getListGuardFree: async (req, res) => {
      try {
        const result = await Manager.getListGuardFree();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getGuardById: async (req, res) => {
      const userId = req.params.guard_id;
      try {
        const user = await Manager.getGuardById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getCustomerById: async (req, res) => {
      const userId = req.params.customer_id;
      try {
        const user = await Manager.getCustomerById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    postNews:async (req, res) => {
      const news = req.body;
      try {
        const postnews = await Manager.postNews(news);
        if (!postnews) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(postnews);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getAllNews:async (req, res) => {
      try {
        const result = await Manager.getAllNews();
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    editNews:async (req, res) => {
      const news = req.body;
      try {
        const postnews = await Manager.editNews(news);
        if (!postnews) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(postnews);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    deleteNews:async (req, res) => {
      const news_id = req.params.news_id;
      try {
        const postnews = await Manager.deleteNews(news_id);
        if (!postnews) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(postnews);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getTop4News:async (req, res) => {
      try {
        const result = await Manager.getTop4News();
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getDetailNews:async (req, res) => {
      const news_id = req.params.news_id;
      try {
        const result = await Manager.getDetailNews(news_id);
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    summary:async (req, res) => {
      try {
        const result = await Manager.summary();
        return res.status(200).json(result[0]);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    SearchGuard:async (req, res) => {
      const query = req.query.q;
      try {
        const result = await Manager.SearchGuard(query);
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    SearchCustomer:async (req, res) => {
      const query = req.query.q;
      try {
        const result = await Manager.SearchCustomer(query);
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    filterByStatus: async (req, res) => {
      const status = req.query.status; // Giá trị status từ query parameter
      try {
        const guards = await Manager.filterByStatus(status);
        res.json(guards);
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
    getMyNoti: async (req, res) => {
      try {
        const result = await Manager.getMyNoti();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    postEnoughGuard: async (req, res) => {
      const bookingname = req.params.bookingname;
      try {
        const result = await Manager.postEnoughGuard(bookingname);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    };
