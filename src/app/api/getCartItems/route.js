import { MongoClient } from 'mongodb';

// Read environment variables from the .env file
const dbAddress = process.env.DB_ADDRESS;
const dbName = process.env.DB_NAME;

// MongoDB client
let client;

// Function to connect to the MongoDB database
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(dbAddress, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
  return client.db(dbName);
}

// Server-side route to handle cart items
export async function GET(request) {
  try {
    
    const { username } = request.headers;

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    // Fetch cart items for the user from the database
    const cartItems = await fetchCartItemsFromDatabase(username);

    return new Response(JSON.stringify(cartItems), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch cart items', {
      status: 500,
    });
  }
}

// Function to fetch cart items from the database
async function fetchCartItemsFromDatabase(username) {
  const db = await connectToDatabase();

  // Access the shopping_cart collection
  const collection = db.collection('shopping_cart');

  // Query to find items for the user 
  const cartItems = await collection
    .find({ username })
    .project({ _id: 1, pname: 1 }) 
    .toArray();

  return cartItems;
}
