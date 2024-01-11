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
        text: 'SELECT users.role,users.passwd,customer.customer_id,customer.firstname,customer.lastname,users.email,customer.img FROM users INNER JOIN customer ON users.users_id = customer.users_id WHERE users.email = $1',
        values: [email],
      };
      const customerresult = await pool.query(queryCustomer);
      const result = customerresult.rows[0];
    return result;
    }
    else if(user.role == 3){
      const queryGuard = {
        text: 'SELECT users.role,guard.guard_id,guard.firstname,guard.lastname,users.email,guard.img FROM users INNER JOIN guard ON users.users_id = guard.users_id WHERE users.email = $1',
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

  resetPasswordForget : async (resettoken, newPasswd) => {
    try {
      const newHashedPassword = await bcrypt.hash(newPasswd, 10);
      const updateQuery = {
        text: 'UPDATE users SET passwd = $1, resettoken = NULL WHERE resettoken = $2',
        values: [newHashedPassword, resettoken],
      };
      await pool.query(updateQuery);
      return 'Password reset successfully';
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
  },

  forgotPassword: async (email, token) => {
    try {
      const updateQuery = {
        text: 'UPDATE users SET resettoken = $1 WHERE email = $2',
        values: [token, email],
      };
      await pool.query(updateQuery);
  
      return 'Password reset token generated and stored successfully';
    } catch (err) {
      console.error('Error:', err);
      throw new Error('An error occurred');
    }
  },
  sendEmail: async (email, resetPasswordLink) => {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'capstoneeduconnect@gmail.com',
        pass: 'eusgqfwhyqrugemi',
      },
    });

    const mailOptions = {
      from: 'capstoneeduconnect@gmail.com',
      to: email,
      subject: 'Reset Password',
      html: `
        <p>Xin chào bạn,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu của mình.</p>
        <p>Nhấp vào liên kết bên dưới để thay đổi mật khẩu của bạn:</p>
        <p><a href="${resetPasswordLink}">Thay đổi mật khẩu của tôi</a></p>
        <br>
        <p>Bỏ qua email này nếu bạn nhớ mật khẩu của mình, hoặc bạn chưa thực hiện yêu cầu.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  },
};