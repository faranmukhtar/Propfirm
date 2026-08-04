import { createCustomer } from '@/lib/db/Customerqueries';
import { redirect } from 'next/navigation';

export default function RegisterPage() {

  async function handleRegister(formData) {
    'use server';

    const fullName = formData.get('fullName') || '';
    const Cnic = formData.get('Cnic');
    const Phonenumber = formData.get('Phonenumber');
    const Email = formData.get('Email');
    const Password = formData.get('Password');

    // 1. Split full name into Fname and Lname
    const parts = fullName.trim().split(/\s+/);
    const Fname = parts[0] || '';
    const Lname = parts.slice(1).join(' ') || '';

    // 2. Save record into MySQL safely
    let success = false;
    try {
      await createCustomer({
        Fname,
        Lname,
        Cnic,
        Phonenumber,
        Email,
        Password,
      });
      success = true;
    } catch (error) {
      console.error('MySQL Error during customer registration:', error);
    }

    // // 3. Send user back to the customer list if inserted successfully
    // if (success) {
    //   redirect('/customers');
    // }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-black">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Customer</h2>

      <form action={handleRegister} className="space-y-4">
        {/* Full Name field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Full Name
          </label>
          <input
            name="fullName"
            type="text"
            placeholder="e.g. Ali Ahmed"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* CNIC field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            CNIC
          </label>
          <input
            name="Cnic"
            type="text"
            placeholder="12345-1234567-1"
            pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"  
            title="Format must be XXXXX-XXXXXXX-X"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Phone Number
          </label>
          <input
            name="Phonenumber"
            type="tel"
            placeholder="03001234567"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            name="Email"
            type="email"
            placeholder="ali@example.com"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <input
            name="Password"
            type="password"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
        >
          Save Customer
        </button>
      </form>
    </div>
  );
}