import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,   // Adds necessary options for MongoDB connection
    useUnifiedTopology: true,
  });

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('products');
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
