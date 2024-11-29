import { MongoClient } from 'mongodb';

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Get email and password from the request body

    // Connect to MongoDB
    const url = process.env.DB_ADDRESS; // MongoDB connection string from environment variable
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(process.env.DB_NAME); // Use environment variable for database name
    const collection = db.collection('login'); // The login collection

    // Find the user by email (username in the DB)
    const user = await collection.findOne({ username: email });

    if (user && user.pass === password) {
      // Authentication successful, return user details and account type
      return new Response(
        JSON.stringify({ success: true, user }), // Returning full user object (including acc_type)
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Invalid credentials
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
