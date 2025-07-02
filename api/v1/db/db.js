import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const createPool = async () => {
  let pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }).promise();

  try {
    const [sqlResult] = await pool.execute('SELECT 1;');

    if (Array.isArray(sqlResult) && sqlResult.length > 0) {
      console.log('Connected to the database');
    }
  } catch (error) {
    pool = null;
    console.error('Error connecting to database:', error);
  }

  return pool;
};

const closePool = async (pool) => {
  try {
    await pool.end();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

export { createPool, closePool };
