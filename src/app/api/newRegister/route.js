import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';  // Import bcrypt

export async function POST(req) {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    // Get the data from the request
    const { email, password, dob } = await req.json();  

    // Check for required fields
    if (!email || !password || !dob) {
      return NextResponse.json(
        { message: 'Email, password, and date of birth are required.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
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

    // New user object
    const newUser = {
      username: email,
      pass: hashedPassword,  // Store the hashed password
      dob: dob,  // Include date of birth
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
