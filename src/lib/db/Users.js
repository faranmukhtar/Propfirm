import db from './index';
import bcrypt from 'bcrypt';

const CUSTOMER_ROLE_ID = 1; // matches Roles table row: 1 = Customer

export async function createCustomer({ Fname, Lname, Cnic, Phonenumber, Email, Password }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(Password, 10);

    const [userResult] = await connection.query(
      `INSERT INTO Users (fname, lname, cnic, email, phonenumber, role_id, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Fname, Lname, Cnic, Email, Phonenumber, CUSTOMER_ROLE_ID, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.query(
      `INSERT INTO Customers (user_id, balance, kyc_status)
       VALUES (?, 0, 'pending')`,
      [userId]
    );

    await connection.commit();
    return userId;

  } catch (error) {
    await connection.rollback();

    // Cnic/Email UNIQUE constraint violations surface here
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('An account with this CNIC or email already exists.');
    }

    throw error;

  } finally {
    connection.release();
  }
}