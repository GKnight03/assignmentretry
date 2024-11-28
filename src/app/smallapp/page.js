'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import LoginPage from './login';
import RegisterPage from './register';

export default function KrispyKremeApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Fetch products when the Dashboard is displayed
  useEffect(() => {
    if (showDash) {
      fetchProducts();
    }
  }, [showDash]);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/getProducts');
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      setData(result);
      setError('');
    } catch (error) {
      setError('Failed to load products. Please try again later.');
    }
  }

  function putInCart(pname) {
    fetch(`/api/putInCart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pname }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Item added to cart!');
        } else {
          setError('Failed to add item to cart.');
        }
      })
      .catch(() => {
        setError('Error adding to cart.');
      });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#D62300' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'sans-serif' }}>
            Krispy Kreme Dashboard
          </Typography>
          <Button color="inherit" onClick={() => setShowFirstPage(true)}>Home</Button>
          <Button color="inherit" onClick={() => setShowLogin(true)}>Sign In</Button>
          <Button color="inherit" onClick={() => setShowDash(true)}>Menu</Button>
        </Toolbar>
      </AppBar>

      {showFirstPage && <Box>Welcome to Krispy Kreme!</Box>}
      {showLogin && <LoginPage />}
      {showDash && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" color="#00653A">Donut Menu</Typography>
          {error && <Typography color="red">{error}</Typography>}
          {data ? (
            data.map((item, i) => (
              <Box key={i} sx={{ border: '1px solid #D62300', p: 2, mb: 2 }}>
                <Typography variant="h6">{item.pname}</Typography>
                <Typography>Price: ${item.price}</Typography>
                <Button onClick={() => putInCart(item.pname)}>Add to Cart</Button>
              </Box>
            ))
          ) : (
            <p>Loading donuts...</p>
          )}
        </Box>
      )}
    </Box>
  );
}
