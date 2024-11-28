import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS; // MongoDB connection string from .env
  const dbName = process.env.DB_NAME; // Database name from .env

  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();

    // Select the database
    const db = client.db(dbName);

    // Access the 'products' collection
    const collection = db.collection('products');

    // Fetch the products from the collection
    const products = await collection.find().toArray();

    console.log('Products fetched:', products);

    return new Response(JSON.stringify(products), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.close();
  }
}
