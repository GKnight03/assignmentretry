import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('shopping_cart');

    // Fetch items grouped by product name (pname) and username
    const items = await collection.aggregate([
      {
        $group: {
          _id: { pname: "$pname", username: "$username" },
          quantity: { $sum: "$quantity" },  // Sum the quantity of the same product for a user
        },
      },
      {
        $project: {
          pname: "$_id.pname",
          username: "$_id.username",
          quantity: 1,
          _id: 0,
        },
      },
    ]).toArray();

    // Log the fetched items
    console.log(items);

    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cart items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
