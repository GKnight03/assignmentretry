import { MongoClient, ServerApiVersion } from 'mongodb';

export async function GET(req, res) {
  console.log("Fetching items from the shopping cart");

  const uri = process.env.DB_ADDRESS; // MongoDB Cloud URL from environment variable
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to MongoDB Cloud");

    // Access the database and collection
    const db = client.db('app'); // Database name
    const collection = db.collection('shopping_cart'); // Collection name

    // Replace with a dynamic username based on authentication
    const username = "sample@test.com"; 
    const items = await collection.find({ username }).toArray();

    console.log("Fetched items:", items);

    // Return the items in JSON format
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching items from the shopping cart:", error);

    return new Response(
      JSON.stringify({ error: 'Failed to fetch items from the shopping cart' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    // Close the client connection
    await client.close();
    console.log("Database connection closed");
  }
}
