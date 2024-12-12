import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';  // Change to bcryptjs

export async function POST(req) {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    const { email, password, dob } = await req.json();

    if (!email || !password || !dob) {
      return NextResponse.json(
        { message: 'Email, password, and date of birth are required.' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const loginCollection = db.collection('login');

    const existingUser = await loginCollection.findOne({ username: email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = {
      username: email,
      pass: hashedPassword,
      dob: dob,
      acc_type: 'customer',
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
