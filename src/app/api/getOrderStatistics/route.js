import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const ordersCollection = db.collection('orders');

    // Aggregate the total orders count and total cost
    const stats = await ordersCollection.aggregate([
      {
        $addFields: {
          totalCost: { $sum: "$items.price" } // If items have prices, sum them
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalCost: { $sum: "$totalCost" } // Sum of `totalCost` calculated from items
        }
      }
    ]).toArray();

    const result = stats.length > 0 ? stats[0] : { totalOrders: 0, totalCost: 0 };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
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
