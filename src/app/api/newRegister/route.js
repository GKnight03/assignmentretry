import { MongoClient } from 'mongodb';

export async function GET(req, res) {
  // Log for debugging purposes
  console.log("in the api page");

  // Get the values that were sent across to us
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');
  const address = searchParams.get('address'); // Corrected field name

  // Log the values for debugging
  console.log(email);
  console.log(pass);
  console.log(address);

  // Connect to MongoDB using DB_ADDRESS
  const client = new MongoClient(process.env.DB_ADDRESS);
  
  try {
    await client.connect();
    const db = client.db('app');  // Ensure your DB name is correct
    const usersCollection = db.collection('login');
    
    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return new Response(JSON.stringify({ data: 'Email already in use' }), { status: 400 });
    }

    // Insert the new user into the collection
    await usersCollection.insertOne({ email, pass, address });
    
    // Return a success response
    return new Response(JSON.stringify({ data: 'valid' }), { status: 200 });
  } catch (err) {
    console.error('Database error:', err);
    return new Response(JSON.stringify({ data: 'Error connecting to the database' }), { status: 500 });
  } finally {
    await client.close();
  }
}
