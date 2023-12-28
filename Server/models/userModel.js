// models/User.js
const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (email, passwd, confirmpasswd, role, firstname, lastname, phone, salary, gender, dob,address) => {
    const hashedPassword = await bcrypt.hash(passwd, 10);
    const usernameQuery = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    const existingUser = await pool.query(usernameQuery);
  
    if (existingUser.rows.length > 0) {
      throw new Error('Email already exists');
    }
    if (passwd !== confirmpasswd) {
      throw new Error('Passwords do not match');
    }
    const query = {
      text: 'INSERT INTO users (email, passwd, role) VALUES ($1, $2, $3) RETURNING users_id',
      values: [email, hashedPassword, role],
    };
  
    try {
      const result = await pool.query(query);
      const userId = result.rows[0].users_id;
      if (role == 2) {
        const customerQuery = {
          text: `INSERT INTO customer (users_id, firstname, lastname, phone, gender, dob,address) VALUES ($1, $2, $3, $4, $5, $6,$7)`,
          values: [userId, firstname, lastname, phone, gender, dob,address],
        };
        await pool.query(customerQuery);
        
      }
      if (role == 3) {
        const status = 1;
        const customerQuery = {
          text: `INSERT INTO guard (users_id, firstname, lastname, phone,salary, gender, dob,address,status) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`,
          values: [userId, firstname, lastname, phone, salary, gender, dob,address,status],
        };
        await pool.query(customerQuery);
        
      }
      return {userId,firstname, lastname, phone};
    } catch (err) {
      throw new Error(err.message);
    }
  },
  //
  loginUser: async (email, passwd) => {
    try {
    const userQuery = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
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
    if (user.role == 1){
      const queryCustomer = {
        text: 'SELECT users.role,users.passwd,manager.manager_id FROM users INNER JOIN manager ON users.users_id = manager.users_id WHERE users.email = $1',
        values: [email],
      };
      const customerresult = await pool.query(queryCustomer);
      const result = customerresult.rows[0];
    return result;
    }
    else if (user.role == 2){
      const queryCustomer = {
        text: 'SELECT users.role,users.passwd,customer.customer_id,customer.firstname,customer.lastname,users.email FROM users INNER JOIN customer ON users.users_id = customer.users_id WHERE users.email = $1',
        values: [email],
      };
      const customerresult = await pool.query(queryCustomer);
      const result = customerresult.rows[0];
    return result;
    }
    else if(user.role == 3){
      const queryGuard = {
        text: 'SELECT users.role,guard.guard_id,guard.firstname,guard.lastname,users.email FROM users INNER JOIN guard ON users.users_id = guard.users_id WHERE users.email = $1',
        values: [email],
      };
      const guardresult = await pool.query(queryGuard);
      const result = guardresult.rows[0];
    return result;
    }
    return user;
    // const user = result.rows[0];
  } catch (err) {
    console.error('Error:', err);
    throw new Error('An error occurred');
  }
  },
  //
  
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