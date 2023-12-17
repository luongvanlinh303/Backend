// controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res) => {
    const { email, passwd, confirmpasswd, role, firstname, lastname, phone, salary, gender, dob, address} = req.body;

    try {
      const newUser = await User.createUser(email, passwd, confirmpasswd, role, firstname, lastname, phone, salary, gender, dob, address);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    const { email, passwd } = req.body;
  
    try {
      const user = await User.loginUser(email, passwd);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user.id }, '130599');
      if(user.role == 1){
        return res.status(200).json({user_id: user.manager_id,role: user.role, token });
      }
      else if(user.role == 2){
        return res.status(200).json({user_id: user.customer_id,firstname: user.firstname,lastname: user.lastname,email: user.email,role: user.role, token });
      }
      else if(user.role == 3){
        return res.status(200).json({user_id: user.guard_id,firstname: user.firstname,lastname: user.lastname,email: user.email,role: user.role, token });
      }
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
