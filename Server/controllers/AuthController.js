// controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res) => {
    const { username, passwd, role } = req.body;

    try {
      const newUser = await User.createUser(username, passwd, role);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    const { username, passwd } = req.body;

    try {
      const user = await User.findByUsername(username);

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(passwd, user.passwd);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};