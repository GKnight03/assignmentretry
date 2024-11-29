'use client'; // Add this at the top of the file

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/getCartItems')
      .then((res) => res.json())
      .then((data) => {
        console.log('Cart Items:', data); // Log cart items to ensure they are being fetched
        setCartItems(data);
        const calculatedTotal = data.reduce((acc, item) => acc + item.price, 0);
        setTotal(calculatedTotal);
      })
      .catch((error) => console.error('Error fetching cart items:', error));
  }, []);

  const handleCheckout = async () => {
    // Check if there are items in the cart
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Prepare the order details to send to the server
    const orderData = {
      items: cartItems,
      totalAmount: total,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        
        alert('Order placed successfully! A confirmation email has been sent.');
        router.push('/smallapp'); 
      } else {
        alert('Error occurred while placing the order: ' + result.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an issue with the checkout process. Please try again later.');
    }
  };

  console.log('Cart Items Length:', cartItems.length); 

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh', padding: 3 }}>
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', color: '#d90166', fontWeight: 'bold' }}
        >
          🍩 Your Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#d90166', mt: 3 }}>
            Your cart is empty.
          </Typography>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                borderBottom: '1px solid #ddd',
                paddingBottom: 2,
                paddingTop: 1,
                marginBottom: 2,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: '#6B4226', fontWeight: 'bold' }}>Items</Typography>
            </Box>
            {cartItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 1,
                  borderBottom: '1px solid #ddd',
                  marginBottom: 2,
                }}
              >
                <Typography sx={{ color: '#6B4226' }}>{item.pname}</Typography>
                <Typography sx={{ color: '#6B4226' }}>${item.price.toFixed(2)}</Typography>
              </Box>
            ))}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#d90166' }}>
                Total: ${total.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FFB5E8',
                  color: '#6B4226',
                  mt: 3,
                  '&:hover': { backgroundColor: '#d90166' },
                }}
                onClick={handleCheckout}
              >
                Place Order
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CartPage;
