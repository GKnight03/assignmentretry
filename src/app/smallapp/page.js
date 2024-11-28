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
import LoginPage from '../login/page'; // Corrected import path for LoginPage
import RegisterPage from '../register/page'; // Corrected import path for RegisterPage

export default function SmallApp() {
  const [activePage, setActivePage] = useState('home'); // Track which page is active
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Fetch products when the Dashboard is displayed
  useEffect(() => {
    if (activePage === 'menu') {
      fetchProducts();
    }
  }, [activePage]);

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
          {/* Button Navigation */}
          <Button color="inherit" onClick={() => setActivePage('home')}>Home</Button>
          <Button color="inherit" onClick={() => setActivePage('login')}>Sign In</Button>
          <Button color="inherit" onClick={() => setActivePage('register')}>Sign Up</Button>
          <Button color="inherit" onClick={() => setActivePage('menu')}>Menu</Button>
        </Toolbar>
      </AppBar>

      {/* Render content based on active page */}
      {activePage === 'home' && <Box>Welcome to Krispy Kreme!</Box>}

      {activePage === 'login' && <LoginPage />}  {/* Show login page */}

      {activePage === 'register' && <RegisterPage />}  {/* Show register page */}

      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" color="#00653A">Donut Menu</Typography>
          {error && <Typography color="red">{error}</Typography>}
          {data ? (
            data.map((item, i) => (
              <Box key={i} sx={{ border: '1px solid #D62300', p: 2, mb: 2 }}>
                <Typography variant="h6">{item.pname}</Typography>
                <Typography>Price: ${item.price}</Typography>
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
