import React, { useEffect, useState } from 'react';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('/api/getCartItems')
      .then((res) => res.json())
      .then((data) => setCartItems(data));
  }, []);

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
