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
      const imagePath = req.file.filename;

    try {
      const result = await Customer.changeImg(userId,filename);
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

};