export async function GET(req, res) {
  // Log that the API page has been accessed
  console.log("in the api page");

  // Import MongoDB client
  const { MongoClient } = require('mongodb');

  // Use the MongoDB Cloud connection string (stored in an environment variable)
  const url = process.env.MONGO_URL; // Ensure this is set in your environment

  // Create the MongoClient instance
  const client = new MongoClient(url);

  const dbName = 'app'; // Database name

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected successfully to MongoDB Cloud');

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection('products'); // Collection name

    // Fetch all documents from the collection
    const findResult = await collection.find({}).toArray();
    console.log('Found Products =>', findResult);

    // Return the result as a JSON response
    return Response.json(findResult);

  } catch (error) {
    // Log and return an error response in case of failure
    console.error('Database connection error:', error);
    return Response.json({ error: 'Failed to fetch data from the database' }, { status: 500 });

  } finally {
    // Ensure the database connection is closed
    await client.close();
    console.log('Database connection closed');
  }
}
