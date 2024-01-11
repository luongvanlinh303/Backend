// config/dbConfig.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db.wyuwwxugcoxngtoqmbfc.supabase.co",
  database: "postgres",
  password: "AS0944663451as",
  port: 5432,
});

module.exports = pool;
