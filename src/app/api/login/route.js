export async function GET(req, res) {
    console.log("in the API page");

    try {
        // Extract parameters from the URL
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const pass = searchParams.get('pass');

        console.log('Received email:', email);
        console.log('Received pass:', pass);

        // MongoDB connection setup
        const { MongoClient } = require('mongodb');
        const url = process.env.DB_ADDRESS; // Use environment variable for DB address
        const client = new MongoClient(url);
        const dbName = 'app'; // database name
        await client.connect();

        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('login'); // collection name

        // Find user in the 'login' collection by email
        const findResult = await collection.find({ "username": email }).toArray();

        console.log('Found documents =>', findResult);

        let valid = false;
        if (findResult.length > 0) {
            valid = true;
            console.log("Login valid");
        } else {
            valid = false;
            console.log("Login invalid");
        }

        // Close the database connection
        await client.close();

        // Return response
        return res.json({ data: valid.toString() });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
