import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS; // MongoDB connection string from .env
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();

    const db = client.db(process.env.DB_NAME); // Get DB name from environment variables
    const collection = db.collection('shopping_cart'); // 'shopping_cart' collection

    const orders = await collection.find().toArray(); // Fetch all orders

    console.log('Orders fetched:', orders);

    return new Response(
      JSON.stringify({ orders }), // Return orders as JSON
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.close();
  }
}
