import { MongoClient } from 'mongodb';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers'; // For working with cookies

const secretPassword = "VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf"; // Secret password for session encryption

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Get email and password 

    // Connect to MongoDB
    const url = process.env.DB_ADDRESS; // MongoDB connection string from environment variable
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(process.env.DB_NAME); 
    const collection = db.collection('login'); 

    // Find the user by email (username in the DB)
    const user = await collection.findOne({ username: email });

    if (user && user.pass === password) {
      // Authentication successful, create a session

      const session = await getIronSession(cookies(), {
        password: secretPassword,
        cookieName: 'app', // The name of your session cookie
      });

      // Store user details in the session
      session.user = {
        email: user.username,
        acc_type: user.acc_type, 
      };
      await session.save(); 

      // Return user details and success response
      return new Response(
        JSON.stringify({ success: true, user: session.user }), 
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
