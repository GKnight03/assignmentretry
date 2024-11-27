import { MongoClient } from 'mongodb';

// MongoDB client setup with environment variable for security
let client;
let clientPromise;

if (process.env.DB_ADDRESS) {
  client = new MongoClient(process.env.DB_ADDRESS);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to MongoDB if not already connected
      if (!client.isConnected()) {
        await clientPromise;
      }
      const db = client.db('app');
      
      // Fetch all orders from the 'orders' collection
      const orders = await db.collection('orders').find().toArray();

      // Return the orders as a JSON response
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return a 500 error response with the message
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  } else {
    // If the method is not GET, return a Method Not Allowed response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
