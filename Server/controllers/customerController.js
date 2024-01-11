const Customer = require('../models/customerModel');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');
module.exports = {
    getUserById: async (req, res) => {
        const userId = req.params.user_id;
        try {
          const user = await Customer.getUserById(userId);
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
          const message = await Customer.changePassword(userId, currentPasswd, newPasswd, confirmNewpasswd);
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
      const result = await Customer.changeInfo(userId, newInfor);
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
        const result = await Customer.changeImg(userId, imageUrl);
        return res.status(200).json({ message: result });
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      }
    },
    // getUserImg: async (req, res) => {
    //   const imageName = req.params.imageName

    // try {
    //   const result = await Customer.getUserImg(imageName);
    //   return res.status(200).json({ message: result });
    // } catch (err) {
    //   console.error('Error:', err);
    //   return res.status(500).json({ message: 'An error occurred' });
    // }
    // },
    getAllGuard: async (req, res) => {
      try {
        const result = await Customer.getallGuard();
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getInfoGuardbyID: async (req, res) => {
      const userId = req.params.user_id;
      try {
        const user = await Customer.getInfoGuardbyID(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    createBooking: async (req, res) => {
      const userId = req.params.user_id; 
      const newBooking = req.body;
      try {
        const result = await Customer.createBooking(userId, newBooking);
        return res.status(200).json({ message: result });
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getmyBooking: async (req, res) => {
      const userId = req.params.user_id;
      try {
        const booking = await Customer.getmyBooking(userId);
        if (!booking) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(booking);
      } catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    getDetailBooking: async (req, res) => {
      const bookingname = req.params.bookingname;
      try {
        const detailbooking = await Customer.getDetailBooking(bookingname);
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
        const detailbooking = await Customer.getDetailBookingOneDay(bookingname,time_start,time_end);
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
    Attendence:async (req, res) => {
      const inforAttendence = req.body;
      try {
        const Attendence = await Customer.Attendence(inforAttendence);
        if (!Attendence) {
          return res.status(404).json({ error: 'Detail Booking not found' });
        }
        res.json(Attendence);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    EditGuardAttendence:async (req, res) => {
      const inforAttendence = req.body;
      try {
        const EditAttendence = await Customer.EditGuardAttendence(inforAttendence);
        if (!EditAttendence) {
          return res.status(404).json({ error: 'Detail Booking not found' });
        }
        res.json(EditAttendence);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    Payment:async (req, res) => {
      const bookingname = req.body.bookingname;
      try {
        const Payment = await Customer.Payment(bookingname);
        res.json(Payment);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    PostFeedBack:async (req, res) => {
      const dataFeedback = req.body;
      try {
        const Feedback = await Customer.PostFeedBack(dataFeedback);
        res.json(Feedback);
      }
      catch (error) {
        console.error('Error retrieving user', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    GetFeedBack: async (req, res) => {
      try {
        const result = await Customer.GetFeedBack();
        return res.status(200).json(result);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingNotPayment: async (req, res) => {
      const customer_id = req.params.customer_id;
      try {
        const result = await Customer.getBookingNotPayment(customer_id);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingPayment: async (req, res) => {
      const customer_id = req.params.customer_id;
      try {
        const result = await Customer.getBookingPayment(customer_id);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getMyNoti: async (req, res) => {
      const customer_id = req.params.customer_id;
      try {
        const result = await Customer.getMyNoti(customer_id);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getpayment: async (req, res) => {
      const customer_id = req.params.customer_id;
      try {
        const result = await Customer.getpayment(customer_id);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    CancelBooking: async (req, res) => {
      const bookingname = req.params.bookingname;
      try {
        const result = await Customer.CancelBooking(bookingname);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    RequestChangeGuard: async (req, res) => {
      const dataGuard = req.body;
      try {
        const result = await Customer.RequestChangeGuard(dataGuard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    }
};