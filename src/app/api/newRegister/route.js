import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';  // Use bcryptjs

export async function POST(req) {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.DB_NAME);
    const loginCollection = db.collection('login');

    // Check if user already exists
    const existingUser = await loginCollection.findOne({ username: email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs async method
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword);

    // New user with the hashed password and default acc_type
    const newUser = {
      username: email,
      pass: hashedPassword,  // Store the hashed password
      acc_type: 'customer',   // Default account type
    };

    console.log('New user data:', newUser);

    // Insert the new user into the database
    const result = await loginCollection.insertOne(newUser);
    console.log('Insert result:', result);

    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error.message || error);
    return NextResponse.json(
      { message: 'Registration failed.', error: error.message || error },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
