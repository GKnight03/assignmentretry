import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';  // Import bcrypt

export async function POST(req) {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
   
    const { username, pass } = await req.json();  // Use 'username' and 'pass' 

   
    if (!username || !pass) {
      return NextResponse.json(
        { message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const loginCollection = db.collection('login');

    // Check if user already exists
    const existingUser = await loginCollection.findOne({ username: username });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this username already exists.' },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(pass, saltRounds);

    // New user object (no dob)
    const newUser = {
      username: username,  
      pass: hashedPassword,  
      acc_type: 'customer',  // Default account type
    };

    // Insert the new user into the database
    await loginCollection.insertOne(newUser);

    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed.' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
