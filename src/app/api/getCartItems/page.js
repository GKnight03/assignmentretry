export async function GET(req, res) {
  console.log("Fetching items from the shopping cart");

  const { MongoClient } = require('mongodb');
  const url = process.env.DB_ADDRESS; // MongoDB Cloud URL
  const client = new MongoClient(url);
  const dbName = 'app'; // Database name

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB Cloud');

    const db = client.db(dbName);
    const collection = db.collection('shopping_cart');

    const username = "sample@test.com"; //  Replace it with a dynamic value based on authentication
    const items = await collection.find({ username }).toArray();

    console.log('Fetched items:', items);

    // Return the items in JSON format
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching items from the shopping cart:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch items from the shopping cart' }),
      { status: 500 }
    );

  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}
