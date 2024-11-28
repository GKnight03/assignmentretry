export async function GET(req, res) {
  // Log that the API page has been accessed
  console.log("In the API page");

  // Import MongoDB client
  const { MongoClient } = require('mongodb');

  // Use the MongoDB Cloud connection string
  const url = "mongodb+srv://root:root1234@cluster0.v7dje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  // Create the MongoClient instance
  const client = new MongoClient(url);

  const dbName = 'app'; // Database name

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected successfully to MongoDB Cloud');

    // Access the database and collection
    const db = client.db('app');
    const collection = db.collection('products'); // Collection name

    // Fetch all documents from the collection
    const findResult = await collection.find({}).toArray();
    console.log('Found Products =>', findResult);

    // Return the result as a JSON response
    return new Response(JSON.stringify(findResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    // Log and return an error response in case of failure
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data from the database' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } finally {
    // Ensure the database connection is closed
    await client.close();
    console.log('Database connection closed');
  }
}
