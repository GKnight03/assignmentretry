import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { pname, username } = await req.json();  // Get product name and username

  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('shopping_cart');

    // Check if the product already exists in the cart for the user
    const existingItem = await collection.findOne({ pname, username });

    if (existingItem) {
      // If it exists, increment the quantity
      await collection.updateOne(
        { _id: existingItem._id },
        { $inc: { quantity: 1 } }  // Increment the quantity by 1
      );
    } else {
      // If it doesn't exist, create a new entry with quantity 1
      await collection.insertOne({ pname, username, quantity: 1 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new Response(JSON.stringify({ error: 'Failed to add item to cart' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
