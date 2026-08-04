// src/lib/db/index.js
import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database_name',
  waitForConnections: true,
  connectionLimit: 10, // Limits maximum active connections
  queueLimit: 0,
};

// Reuse existing pool across Next.js reloads in development
let pool;

if (process.env.NODE_ENV === 'development') {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool(poolConfig);
  }
  pool = global._mysqlPool;
} else {
  pool = mysql.createPool(poolConfig);
}

export const db = pool;
export default pool;