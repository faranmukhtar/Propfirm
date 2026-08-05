import { db } from './index';

export async function getallCustomers() {
  const [rows] = await db.query('SELECT * FROM CUSTOMERS');
  return rows;
}

export async function getCustomerById(id) {
  // Added space between 'await' and 'db'
  const [rows] = await db.query(
    'SELECT * FROM CUSTOMERS WHERE Customerid = ?',
    [id]
  );
  return rows[0] || null;
}

export async function getCustomerbycredentials(email , password){
  const [rows] = await db.query(
    'SELECT * FROM CUSTOMERS WHERE email = ? and password = ?',
    [email , password]
  );
  return rows[0] || null;
}

export async function createCustomer({ Fname, Lname, Cnic, Phonenumber, Email, Password }) {
  const [result] = await db.query(
    `INSERT INTO CUSTOMERS (Fname, Lname, Cnic, Phonenumber, Email, Password)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [Fname, Lname, Cnic, Phonenumber, Email, Password] // Fixed: comma added, all 6 values included
  );
  
  return result.insertId;
}