import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

    // Step 2: Send a confirmation email to the customer using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Gmail user from environment variables
        pass: process.env.GMAIL_PASSWORD, // Gmail password from environment variables
      },
    });

    // Compose the email content
    const emailContent = `
      <h1>Thank you for your order!</h1>
      <p>We have received your order with the following details:</p>
      <h2>Order Summary:</h2>
      <ul>
        ${items.map(item => `
          <li>${item.pname} - $${item.price.toFixed(2)}</li>
        `).join('')}
      </ul>
      <p><strong>Total Amount: $${totalAmount.toFixed(2)}</strong></p>
      <p>Your order will be processed shortly.</p>
      <p>Thank you for choosing our store!</p>
    `;

    // Mail options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Sender email
      to: customerEmail, // Recipient email
      subject: 'Order Confirmation',
      html: emailContent, // HTML email content
    };

    // Send the email
    await transporter.sendMail(mailOptions);

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
