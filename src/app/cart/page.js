import React, { useEffect, useState } from 'react';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items from the API
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const response = await fetch('/api/getCartItems'); // Adjust API endpoint
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          console.error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <p>Product Name: {item.pname}</p>
              <p>User: {item.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
