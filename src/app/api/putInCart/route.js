import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { pname } = await req.json();
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('shopping_cart');
    await collection.insertOne({ pname, username: "sample@test.com" });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add item to cart' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.close();
  }
}
