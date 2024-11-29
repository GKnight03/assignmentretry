"use client"; // Add this line to mark the component as client-side

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/router';

export default function SmallApp() {
  const [activePage, setActivePage] = useState('home'); // Tracks active page
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [cart, setCart] = useState([]); // Track items in the shopping cart

  const router = useRouter();

  // Fetch products when the "menu" page is active
  useEffect(() => {
    if (activePage === 'menu') {
      fetchProducts();
    }
  }, [activePage]);

  // Fetch cart items from the database
  async function fetchCartItems() {
    try {
      const response = await fetch('/api/getCartItems');
      const result = await response.json();
      if (response.ok) {
        setCart(result);
      } else {
        setError('Failed to fetch cart items.');
      }
    } catch (err) {
      setError('Failed to fetch cart items.');
    }
  }

  // Fetch products for menu page
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

  // Function to handle product add to cart
  function handleAddToCart(product) {
    // Add to cart logic here
  }

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#FFB5E8' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#6B4226' }}>
            🍩 KRISPY KREME
          </Typography>
          <Button color="inherit" onClick={() => setActivePage('home')} sx={{ color: '#6B4226' }}>
            Home
          </Button>

          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={() => setActivePage('login')} sx={{ color: '#6B4226' }}>
                Sign In
              </Button>
              <Button color="inherit" onClick={() => setActivePage('register')} sx={{ color: '#6B4226' }}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => setIsLoggedIn(false)} sx={{ color: '#6B4226' }}>
              Logout
            </Button>
          )}
          <Button color="inherit" onClick={() => setActivePage('menu')} sx={{ color: '#6B4226' }}>
            Menu
          </Button>
          {/* Add View Cart Button */}
          <Button color="inherit" onClick={fetchCartItems} sx={{ color: '#6B4226' }}>
            View Cart ({cart.length})
          </Button>
        </Toolbar>
      </AppBar>

      {/* Render content based on active page */}
      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Our Delicious Dough
          </Typography>

          {loading ? (
            <Typography sx={{ textAlign: 'center' }}>Loading products...</Typography>
          ) : (
            <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Paper sx={{ padding: 2 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>{item.pname}</Typography>
                      <Typography>${item.price}</Typography>
                      <Button variant="contained" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                      </Button>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography>No products available.</Typography>
              )}
            </Grid>
          )}
        </Box>
      )}

      {/* View Cart Section */}
      {cart.length > 0 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Your Cart
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
            {cart.map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Paper sx={{ padding: 2 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>{item.pname}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
