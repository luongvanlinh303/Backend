// models/User.js
const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');


module.exports = {
  createUser: async (username, passwd, role) => {
    const hashedPassword = await bcrypt.hash(passwd, 10);
    const query = {
      text: 'INSERT INTO users (username, passwd , role) VALUES ($1, $2, $3) RETURNING *',
      values: [username, hashedPassword, role],
    };
    
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  },
  findByUsername: async (username) => {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  },
};