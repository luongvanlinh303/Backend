// controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res) => {
    const { username, passwd, confirmpasswd, role, firstname, lastname, phone} = req.body;

    try {
      const newUser = await User.createUser(username, passwd, confirmpasswd, role, firstname, lastname, phone);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    const { username, passwd } = req.body;
  
    try {
      const user = await User.loginUser(username, passwd);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ userId: user.id }, 'secretKey');
  
      return res.status(200).json({ token });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
  },
  changePassword : async (req, res) => {
    const { userId, currentPasswd, newPasswd , confirmNewpasswd} = req.body;
  
    try {
      const message = await User.changePassword(userId, currentPasswd, newPasswd,confirmNewpasswd);
      return res.status(200).json({ message });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
  },
  
  resetPassword : async (req, res) => {
    const { userId, newPasswd } = req.body;
  
    try {
      const message = await User.resetPassword(userId, newPasswd);
      return res.status(200).json({ message });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
  },
};