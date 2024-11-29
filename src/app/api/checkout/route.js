import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // MongoDB connection helper

export async function POST(req) {
  // Parse the incoming JSON request body
  const { items, totalAmount, customerEmail } = await req.json();

  // Step 1: Store the order in the database
  try {
    const { db } = await connectToDatabase(); // Get the DB connection
    const ordersCollection = db.collection('orders'); // Access the 'orders' collection

    // Create a new order document
    const newOrder = {
      items,
      totalAmount,
      status: 'pending', // Initially set the order status as 'pending'
      customerEmail,
      createdAt: new Date(),
    };

    // Insert the new order document into the 'orders' collection
    const order = await ordersCollection.insertOne(newOrder);

    // Step 2: Simulate email sent message
    console.log(`Order confirmation email sent to ${customerEmail}`);

    // Step 3: Respond with success
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully! A confirmation email has been sent.',
    });

  } catch (error) {
    console.error('Error during checkout process:', error);
    return NextResponse.json({
      success: false,
      message: 'There was an issue processing your order. Please try again.',
    });
  }
}
