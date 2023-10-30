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
      const userId = req.params.user_id; // Lấy guard_id từ URL parameter
      const newInfor = req.body; // Lấy thông tin mới từ body request

    try {
      const result = await Customer.changeInfo(userId, newInfor);
      return res.status(200).json({ message: result });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    },
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
};