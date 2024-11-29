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
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#FFB5E8' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#6B4226' }}>
            🍩 EVIL KRISPY KREME
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B4226', marginRight: 2 }}>
            {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
          </Typography>
          <Button color="inherit" onClick={() => setActivePage('home')} sx={{ color: '#6B4226' }}>
            Home
          </Button>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={() => router.push('/login')} sx={{ color: '#6B4226' }}>
                Sign In
              </Button>
              <Button color="inherit" onClick={() => router.push('/register')} sx={{ color: '#6B4226' }}>
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
          <Button color="inherit" onClick={() => setActivePage('cart')} sx={{ color: '#6B4226' }}>
            View Cart ({cart.length})
          </Button>
        </Toolbar>
      </AppBar>

      {activePage === 'home' && (
        <Box sx={{ textAlign: 'center', marginTop: 5 }}>
          <Typography variant="h4" sx={{ color: 'red', fontWeight: 'bold' }}>
            Welcome to EVIL Krispy Kreme!
          </Typography>
          <img
            src="https://i.ytimg.com/vi/K41lo4Efr7I/maxresdefault.jpg"
            alt="Shaquille O'Neal"
            style={{ width: '300px', height: 'auto', marginTop: '20px', borderRadius: '10px' }}
          />
        </Box>
      )}

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

      {activePage === 'cart' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Your Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography sx={{ textAlign: 'center' }}>Your cart is empty.</Typography>
          ) : (
            <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
              {cart.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper sx={{ padding: 2 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.pname}</Typography>
                    <Typography>Quantity: {item.quantity}</Typography>
                    <Typography>Price: ${item.price * item.quantity}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          <Typography sx={{ textAlign: 'center', mt: 3, fontWeight: 'bold' }}>
            Total: ${calculateTotal()}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
