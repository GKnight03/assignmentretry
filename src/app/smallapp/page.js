"use client"; // Add this line to mark the component as client-side

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
import Paper from '@mui/material/Paper'; // Import Paper for wrapping items

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

  // Function to safely format the price
  const formatPrice = (price) => {
    const numericPrice = parseFloat(price); // Convert to number
    if (!isNaN(numericPrice)) {
      return numericPrice.toFixed(2); // Return formatted price to 2 decimal places
    }
    return 'Invalid Price'; // Handle invalid price case
  };

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
                  <Paper
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
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No products available.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
