import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS; // MongoDB URI from .env file
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log('Connecting to MongoDB with URI:', uri); // Log URI for debugging
    await client.connect();
    console.log('MongoDB connection established');

    const db = client.db(process.env.DB_NAME); // Use the DB_NAME from the .env
    const collection = db.collection('products');
    const products = await collection.find().toArray();

    console.log('Fetched products:', products);
    return new Response(JSON.stringify(products), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.close();
  }
}
