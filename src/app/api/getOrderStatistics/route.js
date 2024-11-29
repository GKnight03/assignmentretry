// app/api/getOrderStatistics/route.js
import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('orders');  // Assuming 'orders' collection holds all the orders

    const orders = await collection.find({}).toArray();

    // Calculate total number of orders and total cost
    const totalOrders = orders.length;
    const totalCost = orders.reduce((sum, order) => sum + order.totalPrice, 0); // Assuming 'totalPrice' is the field in the order

    return new Response(
      JSON.stringify({
        totalOrders,
        totalCost,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch order statistics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
