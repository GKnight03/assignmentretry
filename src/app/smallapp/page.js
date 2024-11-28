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

export default function SmallApp() {
  const [activePage, setActivePage] = useState('home'); // Tracks active page
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Fetch products when the "menu" page is active
  useEffect(() => {
    if (activePage === 'menu') {
      fetchProducts();
    }
  }, [activePage]);

  async function fetchProducts() {
    try {
      // Mock product fetch logic
      const response = await fetch('/api/products'); // Adjust your API endpoint
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch products.');
    }
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'sans-serif' }}>
            Krispy Kreme Dashboard
          </Typography>
          <Button color="inherit" onClick={() => setActivePage('home')}>Home</Button>
          <Button color="inherit" onClick={() => setActivePage('login')}>Sign In</Button>
          <Button color="inherit" onClick={() => setActivePage('register')}>Sign Up</Button>
          <Button color="inherit" onClick={() => setActivePage('menu')}>Menu</Button>
        </Toolbar>
      </AppBar>

      {/* Render content based on active page */}
      {activePage === 'home' && <Box sx={{ p: 3 }}>Welcome to Krispy Kreme!</Box>}

      {activePage === 'login' && <LoginPage />}  {/* Show login page */}

      {activePage === 'register' && <RegisterPage />}  {/* Show register page */}

      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" color="#00653A">Donut Menu</Typography>
          {error && <Typography color="red">{error}</Typography>}
          {data ? (
            <Box>{/* Render product data here */}</Box>
          ) : (
            <Typography>Loading products...</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
