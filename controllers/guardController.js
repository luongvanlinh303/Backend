const Guard = require('../models/guardModel');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');
module.exports = {
    getUserById: async (req, res) => {
        const userId = req.params.user_id;
        try {
          const user = await Guard.getUserById(userId);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.json(user);
        } catch (error) {
          console.error('Error retrieving user', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },
      changePassword : async (req, res) => {
        const { userId, currentPasswd, newPasswd , confirmNewpasswd} = req.body;
      
        try {
          const message = await Guard.changePassword(userId, currentPasswd, newPasswd, confirmNewpasswd);
          return res.status(200).json({ message });
        } catch (err) {
          console.error('Error:', err);
          return res.status(500).json({ message: 'An error occurred' });
        }
      },
    changeUserInfo: async (req, res) => {
      const userId = req.params.user_id; 
      const newInfor = req.body;

    try {
      const result = await Guard.changeInfo(userId, newInfor);
      return res.status(200).json({ message: result });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    },
    changeUserImg: async (req, res) => {
      const userId = req.params.user_id;
      const imageUrl = req.body.img; 
  
      try {
        const result = await Guard.changeImg(userId, imageUrl);
        return res.status(200).json({ message: result });
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      }
    },
    getInfoCustomerbyID: async (req, res) => {
      const userId = req.params.user_id;
      try {
        const user = await Customer.getInfoCustomerbyID(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getDetailBooking: async (req, res) => {
      const bookingname = req.params.bookingname;
      try {
        const detailbooking = await Guard.getDetailBooking(bookingname);
        if (!detailbooking) {
          return res.status(404).json({ error: 'Detail Booking not found' });
        }
        res.json(detailbooking);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getDetailBookingOneDay:async (req, res) => {
      const bookingname = req.query.bookingname;
      const time_start = req.query.time_start;
      const time_end = req.query.time_end;
      try {
        const detailbooking = await Guard.getDetailBookingOneDay(bookingname,time_start,time_end);
        if (!detailbooking) {
          return res.status(404).json({ error: 'Detail Booking not found' });
        }
        res.json(detailbooking);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getListMyBooking:async (req, res) => {
      const guard_id = req.params.user_id;
      try {
        const detailbooking = await Guard.getListMyBooking(guard_id);
        if (!detailbooking) {
          return res.status(404).json({ error: 'Detail Booking not found' });
        }
        res.json(detailbooking);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getmyBooking: async (req, res) => {
      const userId = req.params.user_id;
      try {
        const booking = await Guard.getmyBooking(userId);
        if (!booking) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(booking);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getMyFeedBack: async (req, res) => {
      const userId = req.params.user_id;
      try {
        const feedback = await Guard.getMyFeedBack(userId);
        return res.status(200).json(feedback);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getMyNoti: async (req, res) => {
      const guard_id = req.params.guard_id;
      try {
        const result = await Guard.getMyNoti(guard_id);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    }

};