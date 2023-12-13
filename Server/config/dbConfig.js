// config/dbConfig.js
const { Pool } = require('pg');

const pool = new Pool({
  // connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  user: 'postgres',
  host: 'localhost',
  database: 'GuardSystem',
  password: '123456',
  port: 5432,
});

module.exports = pool;