// models/User.js
const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (username, passwd, confirmpasswd, role, firstname, lastname, phone) => {
    const hashedPassword = await bcrypt.hash(passwd, 10);
    const usernameQuery = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const existingUser = await pool.query(usernameQuery);
  
    if (existingUser.rows.length > 0) {
      throw new Error('Username already exists');
    }
    if (passwd !== confirmpasswd) {
      throw new Error('Passwords do not match');
    }
    const query = {
      text: 'INSERT INTO users (username, passwd, role) VALUES ($1, $2, $3) RETURNING users_id',
      values: [username, hashedPassword, role],
    };
  
    try {
      const result = await pool.query(query);
      const userId = result.rows[0].users_id;
      if (role == 2) {
        const customerQuery = {
          text: `INSERT INTO customer (users_id, firstname, lastname, phone) VALUES ($1, $2, $3, $4)`,
          values: [userId, firstname, lastname, phone],
        };
        await pool.query(customerQuery);
        
      }
      if (role == 3) {
        const customerQuery = {
          text: `INSERT INTO guard (users_id, firstname, lastname, phone) VALUES ($1, $2, $3, $4)`,
          values: [userId, firstname, lastname, phone],
        };
        await pool.query(customerQuery);
        
      }
      return {userId,firstname, lastname, phone};
    } catch (err) {
      throw new Error(err.message);
    }
  },
  //
  loginUser: async (username, passwd) => {
    try {
    const userQuery = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const result = await pool.query(userQuery);
    const user = result.rows[0];

    if (!user) {
      return null;
    }

    const isPasswordMatched = await bcrypt.compare(passwd, user.passwd);
    if (!isPasswordMatched) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error:', err);
    throw new Error('An error occurred');
  }
  },
  //
  changePassword: async (userId, currentPasswd, newPasswd, confirmNewpasswd) => {
    try {
      // Lấy thông tin người dùng từ cơ sở dữ liệu
      const userQuery = {
        text: 'SELECT passwd FROM users WHERE users_id = $1',
        values: [userId],
      };
      const result = await pool.query(userQuery);
      const hashedPassword = result.rows[0].passwd;
  
      // So sánh mật khẩu hiện tại
      const isPasswordMatched = await bcrypt.compare(currentPasswd, hashedPassword);
      if (!isPasswordMatched) {
        throw new Error('Current password is incorrect');
      }
  
      // Hash mật khẩu mới
      const newHashedPassword = await bcrypt.hash(newPasswd, 10);
      const confirmNewHashedPassword = await bcrypt.hash(confirmNewpasswd, 10);
      // Cập nhật mật khẩu mới vào cơ sở dữ liệu
      if (newPasswd == confirmNewpasswd){
        const updateQuery = {
        text: 'UPDATE users SET passwd = $1 WHERE users_id = $2',
        values: [newHashedPassword, userId],
      };
      await pool.query(updateQuery);
      return 'Password changed successfully';
    }
      else {
        return 'Password confirm different with new password';
      }
      
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
  },
  //
  resetPassword : async (userId, newPasswd) => {
    try {
      // Hash mật khẩu mới
      const newHashedPassword = await bcrypt.hash(newPasswd, 10);
  
      // Cập nhật mật khẩu mới vào cơ sở dữ liệu
      const updateQuery = {
        text: 'UPDATE users SET passwd = $1 WHERE users_id = $2',
        values: [newHashedPassword, userId],
      };
      await pool.query(updateQuery);
  
      return 'Password reset successfully';
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
  },
  
};