'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import LoginPage from '../login/page';
import RegisterPage from '../register/page';
import ManagerDashboard from '../manager/page'; // Import ManagerDashboard
import Grid from '@mui/material/Grid'; // Import Grid

export default function SmallApp() {
  const [activePage, setActivePage] = useState('home'); // Tracks active page
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accType, setAccType] = useState(''); // Track account type
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [cart, setCart] = useState([]); // Track items in the shopping cart

  // Fetch products when the "menu" page is active
  useEffect(() => {
    if (activePage === 'menu') {
      fetchProducts();
    }
  }, [activePage]);

  async function fetchProducts() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/getProducts');
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }

  // Add product to cart
  function handleAddToCart(product) {
    setCart((prevCart) => [...prevCart, product]);
  }

  // Remove product from cart
  function handleRemoveFromCart(productName) {
    setCart((prevCart) => prevCart.filter((item) => item.pname !== productName));
  }

  // Calculate total cost
  function calculateTotal() {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2); // Assuming products have a 'price' field
  }

  // Function to safely format the price
  const formatPrice = (price) => {
    const numericPrice = parseFloat(price); // Convert to number
    if (!isNaN(numericPrice)) {
      return numericPrice.toFixed(2); // Return formatted price to 2 decimal places
    }
    return 'Invalid Price'; // Handle invalid price case
  };

  // Handle login success
  function handleLoginSuccess(accType) {
    setAccType(accType); // Set the account type after successful login
    setIsLoggedIn(true); // Mark as logged in
    if (accType === 'manager') {
      setActivePage('manager'); // Navigate to ManagerDashboard if the user is a manager
    } else {
      setActivePage('home'); // Navigate to Home if not a manager
    }
  }

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#FFB5E8' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'Comic Sans MS, sans-serif',
              color: '#6B4226',
            }}
          >
            🍩 KRISPY KREME
          </Typography>
          <Button
            color="inherit"
            onClick={() => setActivePage('smallapp')}
            sx={{ color: '#6B4226', fontWeight: 'bold' }}
          >
            Home
          </Button>
          {!isLoggedIn && (
            <>
              <Button
                color="inherit"
                onClick={() => setActivePage('login')}
                sx={{ color: '#6B4226', fontWeight: 'bold' }}
              >
                Sign In
              </Button>
              <Button
                color="inherit"
                onClick={() => setActivePage('register')}
                sx={{ color: '#6B4226', fontWeight: 'bold' }}
              >
                Sign Up
              </Button>
            </>
          )}
          {isLoggedIn && (
            <Button
              color="inherit"
              onClick={() => {
                setIsLoggedIn(false);
                setAccType('');
                setActivePage('home');
              }}
              sx={{ color: '#6B4226', fontWeight: 'bold' }}
            >
              Logout
            </Button>
          )}
          <Button
            color="inherit"
            onClick={() => setActivePage('menu')}
            sx={{ color: '#6B4226', fontWeight: 'bold' }}
          >
            Menu
          </Button>
        </Toolbar>
      </AppBar>

      {/* Render content based on active page */}
      {activePage === 'home' && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: 'Comic Sans MS, sans-serif', color: '#6B4226' }}
          >
            Welcome to KRISPY KREME! 🍩
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: '#6B4226' }}>
            Where every bite is a delight!
          </Typography>
        </Box>
      )}

      {activePage === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {activePage === 'register' && <RegisterPage />}

      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              color: '#6B4226',
              fontFamily: 'Comic Sans MS, sans-serif',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Our Delicious Dough
          </Typography>

          {error && (
            <Typography color="red" sx={{ textAlign: 'center', mt: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Typography sx={{ textAlign: 'center', mt: 3 }}>
              Loading products...
            </Typography>
          ) : data && data.length > 0 ? (
            <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
              {data.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      backgroundColor: '#FFF1F1',
                      padding: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Product Name */}
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: '#6B4226',
                        fontSize: '1.2rem',
                        marginBottom: 1,
                      }}
                    >
                      {item.pname}
                    </Typography>

                    {/* Product Price */}
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        color: '#6B4226',
                        marginBottom: 2,
                      }}
                    >
                      ${formatPrice(item.price)}
                    </Typography>

                    {/* Add to Cart Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(item)}
                      sx={{
                        backgroundColor: '#FFB5E8',
                        color: '#6B4226',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#FF8D9E',
                        },
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No products available.</Typography>
          )}
        </Box>
      )}

      {activePage === 'checkout' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', color: '#6B4226' }}>
            Checkout
          </Typography>
          <Box sx={{ mt: 2 }}>
            {cart.length === 0 ? (
              <Typography>No items in the cart</Typography>
            ) : (
              <Box>
                {cart.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{item.pname}</Typography>
                    <Button onClick={() => handleRemoveFromCart(item.pname)}>Remove</Button>
                  </Box>
                ))}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Total: ${calculateTotal()}</Typography>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => alert('Order placed successfully!')}
                  >
                    Place Order
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Render Manager Dashboard if account type is manager */}
      {activePage === 'manager' && <ManagerDashboard />}
    </Box>
  );
}
