import { getCustomSession } from "../sessionCode.js";

export async function GET(req, res) {
  try {
    // Get the session data
    let session = await getCustomSession();
    
    // If no session found, return an error
    if (!session) {
      return res.status(401).json({ message: "Session not found" });
    }

    let customersRole = session.role;
    let email = session.email;

    // Log the role and email for debugging
    console.log("Customer's Role:", customersRole);
    console.log("Customer's Email:", email);

    // Return a response
    return res.json({ role: customersRole, email: email });

  } catch (error) {
    // Handle any errors that may occur during session fetching
    console.error('Error fetching session:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
