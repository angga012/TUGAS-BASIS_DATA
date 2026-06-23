const { Pool } = require('pg');

// Configure via environment variables or fallback to local defaults
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || null,
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'booking_futsal',
});

module.exports = pool;
