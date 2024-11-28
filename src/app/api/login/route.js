import { MongoClient } from 'mongodb';

export async function POST(req, res) {
  try {
    const { email, password } = await req.json();  // Get email and password from the request body

    // Connect to MongoDB
    const url = process.env.DB_ADDRESS;  // MongoDB connection string from environment variable
    const client = new MongoClient(url);
    const db = client.db('app');  // Database name
    const collection = db.collection('login');  // The login collection

    // Find the user by email
    const user = await collection.findOne({ username: email });

    if (user && user.pass === password) {
      // Authentication successful, return user details and success message
      return res.json({ success: true, user });
    } else {
      // Invalid credentials
      return res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
