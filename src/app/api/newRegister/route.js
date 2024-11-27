export async function POST(req, res) {
    // Log to console that we're in the API route.
    console.log("In the newRegister API route");
  
    try {
      // Parse the request body to get the JSON data
      const { email, pass, address } = await req.json();
  
      // Log the received data
      console.log("Received email:", email);
      console.log("Received pass:", pass);
      console.log("Received address:", address);
  
      // Simple validation to check if all fields are present
      if (!email || !pass || !address) {
        return new Response(
          JSON.stringify({ data: "missing_fields", message: "Please provide all fields." }),
          { status: 400 }
        );
      }
  
      // Simulate database call (replace with actual logic)
      // For example: await db.users.create({ email, pass, address });
  
      // If successful, send a response
      return new Response(
        JSON.stringify({ data: "valid", message: "Registration successful." }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during registration:", error);
      return new Response(
        JSON.stringify({ data: "error", message: "An error occurred. Please try again later." }),
        { status: 500 }
      );
    }
  }
  