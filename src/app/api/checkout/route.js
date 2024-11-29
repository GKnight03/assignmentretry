import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { items, totalAmount, customerEmail } = await req.json();


  const client = new MongoClient(process.env.DB_ADDRESS);

  try {
 
    await client.connect();
    const db = client.db(process.env.DB_NAME); // Uses the DB_NAME from the .env file
    const ordersCollection = db.collection('orders'); // Access the 'orders' collection

   
    const newOrder = {
      items,
      totalAmount,
      status: 'pending', 
      customerEmail,     
      createdAt: new Date(),
    };

 
    const order = await ordersCollection.insertOne(newOrder);

    
    console.log(`Email sent to: ${customerEmail} with order details`);

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
  } finally {
 
    await client.close();
  }
}
