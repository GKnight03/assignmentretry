'use client'; // Add this at the top of the file

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/getCartItems')
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
        const calculatedTotal = data.reduce((acc, item) => acc + item.price, 0);
        setTotal(calculatedTotal);
      })
      .catch((error) => console.error('Error fetching cart items:', error));
  }, []);

  const handleCheckout = () => {
    // Here you can add the logic to handle the checkout process, like submitting the order to the backend
    alert('Order placed successfully!');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', color: '#6B4226' }}>
        Your Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#6B4226', mt: 3 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <Box sx={{ mt: 3 }}>
          <ul>
            {cartItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 1,
                  borderBottom: '1px solid #ddd',
                }}
              >
                <Typography sx={{ color: '#6B4226' }}>{item.pname}</Typography>
                <Typography sx={{ color: '#6B4226' }}>${item.price.toFixed(2)}</Typography>
              </Box>
            ))}
          </ul>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#6B4226' }}>
              Total: ${total.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CartPage;
