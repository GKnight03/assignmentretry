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
  const [activePage, setActivePage] = useState('home');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Set state to true once the component mounts
    if (isLoggedIn) {
      fetchCartItems();
      fetchWeather();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (activePage === 'menu') {
      fetchProducts();
    }
  }, [activePage]);

  // Fetch cart items
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

  // Fetch products for menu
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

  // Fetch weather data
  async function fetchWeather() {
    try {
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=YOUR_CITY&appid=YOUR_API_KEY');
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      } else {
        setWeatherError('Failed to fetch weather');
      }
    } catch (err) {
      setWeatherError('Failed to fetch weather');
    }
  }

  // Handle checkout process
  async function handleCheckout() {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ items: cart, totalAmount: calculateTotal() }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert('Order confirmed!');
        setCart([]); // Empty the cart after successful checkout
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (err) {
      alert('Error during checkout');
    }
  }

  // Calculate the total of the cart
  function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  if (!isClient) {
    return null; // Return null to avoid server-side rendering issues
  }

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#FFB5E8' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#6B4226' }}>
            🍩 KRISPY KREME
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B4226' }}>
            {weather ? `Weather: ${weather.main.temp}°C` : weatherError || 'Loading Weather...'}
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
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
