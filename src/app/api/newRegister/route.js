import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';  // Import bcrypt

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

    await client.connect();
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

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // New user with the hashed password and default acc_type
    const newUser = {
      username: email,
      pass: hashedPassword,  // Store the hashed password
      acc_type: 'customer',   // Default account type
    };

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
