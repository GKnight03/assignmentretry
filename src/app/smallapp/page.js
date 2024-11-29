'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function SmallApp() {
  const [activePage, setActivePage] = useState('home');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (activePage === 'menu') {
      fetchProducts();
    }
  }, [activePage]);

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

  function handleAddToCart(product) {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item._id === product._id);

    if (productIndex >= 0) {
      updatedCart[productIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
  }

  function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  return (
    <Box sx={{ backgroundColor: '#3E3B3D', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#2A2A2A' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#FF0000' }}>
            🍩 EVIL KRISPY KREME
          </Typography>
          <Typography variant="body2" sx={{ color: '#FF0000', marginRight: 2 }}>
            {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
          </Typography>
          <Button color="inherit" onClick={() => setActivePage('home')} sx={{ color: '#FF0000' }}>
            Home
          </Button>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={() => router.push('/login')} sx={{ color: '#FF0000' }}>
                Sign In
              </Button>
              <Button color="inherit" onClick={() => router.push('/register')} sx={{ color: '#FF0000' }}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => setIsLoggedIn(false)} sx={{ color: '#FF0000' }}>
              Logout
            </Button>
          )}
          <Button color="inherit" onClick={() => setActivePage('menu')} sx={{ color: '#FF0000' }}>
            Menu
          </Button>
          <Button color="inherit" onClick={() => setActivePage('cart')} sx={{ color: '#FF0000' }}>
            View Cart ({cart.length})
          </Button>
        </Toolbar>
      </AppBar>

      {activePage === 'home' && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF0000' }}>
            Welcome to the EVIL Krispy Kreme!
          </Typography>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxJn-ntAT3js8lohog2uYJpVNWQP2nA4Iflg&s"
            alt="Shaquille O'Neal"
            style={{ width: '300px', height: 'auto', marginTop: '20px', borderRadius: '10px' }}
          />
        </Box>
      )}

      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#FF0000' }}>
            The Forbidden Dough
          </Typography>
          {loading ? (
            <Typography sx={{ textAlign: 'center', color: '#FF0000' }}>Summoning products...</Typography>
          ) : (
            <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Paper sx={{ padding: 2, backgroundColor: '#2A2A2A' }}>
                      <Typography sx={{ fontWeight: 'bold', color: '#FF0000' }}>{item.pname}</Typography>
                      <Typography sx={{ color: '#FF0000' }}>${item.price}</Typography>
                      <Button variant="contained" onClick={() => handleAddToCart(item)} sx={{ backgroundColor: '#FF0000' }}>
                        Add to Cart
                      </Button>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography sx={{ color: '#FF0000' }}>No products available.</Typography>
              )}
            </Grid>
          )}
        </Box>
      )}

      {activePage === 'cart' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#FF0000' }}>
            Your Dark Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#FF0000' }}>Your cart is empty.</Typography>
          ) : (
            <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
              {cart.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper sx={{ padding: 2, backgroundColor: '#2A2A2A' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#FF0000' }}>{item.pname}</Typography>
                    <Typography sx={{ color: '#FF0000' }}>Quantity: {item.quantity}</Typography>
                    <Typography sx={{ color: '#FF0000' }}>Price: ${item.price * item.quantity}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          <Typography sx={{ textAlign: 'center', mt: 3, fontWeight: 'bold', color: '#FF0000' }}>
            Total: ${calculateTotal()}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
