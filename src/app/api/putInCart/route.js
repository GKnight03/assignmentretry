import { MongoClient } from 'mongodb';

export async function POST(req) {
  const { pname, username } = await req.json(); // Get product name and username

  const uri = process.env.DB_ADDRESS;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('shopping_cart');
    const productsCollection = db.collection('products'); // Assuming you have a products collection to fetch product price

    // Fetch the product details from the products collection (assuming the product has a 'price' field)
    const product = await productsCollection.findOne({ pname });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the product already exists in the cart for the user
    const existingItem = await collection.findOne({ pname, username });

    if (existingItem) {
      // If it exists, increment the quantity
      await collection.updateOne(
        { _id: existingItem._id },
        { $inc: { quantity: 1 } } // Increment the quantity by 1
      );
    } else {
      // If it doesn't exist, create a new entry with quantity 1 and product price
      await collection.insertOne({
        pname,
        username,
        quantity: 1,
        price: product.price, // Add price to the cart item
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new Response(JSON.stringify({ error: 'Failed to add item to cart' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
