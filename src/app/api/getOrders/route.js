import { MongoClient } from 'mongodb';

// MongoDB client setup with environment variable for security
const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to MongoDB
      await client.connect();
      const db = client.db('app');
      
      // Fetch all orders from the 'orders' collection
      const orders = await db.collection('orders').find().toArray();

      // Return the orders as a JSON response
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return a 500 error response with the message
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    } finally {
      // Close the MongoDB connection after processing the request
      await client.close();
    }
  } else {
    // If the method is not GET, return a Method Not Allowed response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
