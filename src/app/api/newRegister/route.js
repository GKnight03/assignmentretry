import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { email, password } = await req.json(); // Removed username
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: 'Email and password are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const loginCollection = db.collection('login');

    // Check if the user already exists
    const existingUser = await loginCollection.findOne({ username: email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User with this email already exists.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the new user with acc_type 'customer'
    const newUser = {
      username: email,      // Store email as username
      pass: password,       // Store password as 'pass'
      acc_type: 'customer'  // Default account type
    };

    // Insert new user into the database
    await loginCollection.insertOne(newUser);

    return new Response(
      JSON.stringify({ message: 'User registered successfully.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({ message: 'Registration failed.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.close();
  }
}
