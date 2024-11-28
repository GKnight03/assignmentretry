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
  const [loading, setLoading] = useState(false);

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

  async function handleAddToCart(pname) {
    try {
      const response = await fetch('/api/putInCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pname }),  // Send pname, not name
      });

      if (response.ok) {
        console.log(`${pname} added to cart successfully.`);
      } else {
        console.error('Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
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
            onClick={() => setActivePage('home')}
            sx={{ color: '#6B4226', fontWeight: 'bold' }}
          >
            Home
          </Button>
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

      {activePage === 'login' && <LoginPage />} {/* Show login page */}

      {activePage === 'register' && <RegisterPage />} {/* Show register page */}

      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: '#6B4226',
              fontFamily: 'Comic Sans MS, sans-serif',
              textAlign: 'center',
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
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
                mt: 3,
              }}
            >
              {data.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 200,
                    height: 300,
                    backgroundColor: '#FFF1E6',
                    borderRadius: 4,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: 2,
                    display: 'flex',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#6B4226', fontWeight: 'bold' }}>
                    {item.pname}  {/* Use pname instead of name */}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#6B4226' }}>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2, color: '#FF69B4' }}>
                    ${item.price}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#FFB5E8',
                      color: '#6B4226',
                      fontWeight: 'bold',
                      mt: 2,
                    }}
                    onClick={() => handleAddToCart(item.pname)}  // Pass pname here
                  >
                    Add to Cart
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', mt: 3 }}>
              No products available.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
