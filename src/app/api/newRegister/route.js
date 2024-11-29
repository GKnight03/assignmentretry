import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { email, password } = await req.json(); 
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
    const users = db.collection('users');

    // Check if the user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User with this email already exists.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the new user
    const newUser = { email, password }; 

    // Insert new user into the database
    await users.insertOne(newUser);

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
