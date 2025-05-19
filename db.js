const { Pool } = require('pg');
require('dotenv').config();

// Create a pool of connections to PostgreSQL using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Export pool to be used by other files
module.exports = pool;
