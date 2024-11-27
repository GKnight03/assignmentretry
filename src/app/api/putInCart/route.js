export async function GET(req, res) {
  // Log that the API page has been accessed
  console.log("in the putInCart api page");

  // Get the values that were sent to the API
  const { searchParams } = new URL(req.url);
  const pname = searchParams.get('pname');

  console.log(pname);

  // =================================================

  const { MongoClient } = require('mongodb');

  // Use MongoDB Cloud URL (set this in an environment variable for security)
  const url = process.env.MONGO_URL; // Ensure this environment variable is configured

  const client = new MongoClient(url);

  const dbName = 'app'; // Database name

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected successfully to MongoDB Cloud');

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection('shopping_cart'); // Collection name

    // Prepare the object to insert into the shopping_cart collection
    const myobj = { pname: pname, username: "sample@test.com" };

    // Insert the document into the collection
    const insertResult = await collection.insertOne(myobj);
    console.log('Insert result:', insertResult);

    // Return a success message in the response
    return Response.json({ data: "inserted" });

  } catch (error) {
    // Log and return an error response in case of failure
    console.error('Error inserting into the shopping cart:', error);
    return Response.json({ error: 'Failed to insert into the shopping cart' }, { status: 500 });

  } finally {
    // Ensure the database connection is closed
    await client.close();
    console.log('Database connection closed');
  }
}
