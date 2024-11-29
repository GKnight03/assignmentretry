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

export default function SmallApp() {
  const [activePage, setActivePage] = useState('home'); // Tracks active page
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accType, setAccType] = useState(''); // Track account type
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

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
        body: JSON.stringify({ pname }),
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
            onClick={() => setActivePage('home')}
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
        <LoginPage onLoginSuccess={(accType) => handleLoginSuccess(accType)} />
      )}

      {activePage === 'register' && <RegisterPage />}

      {activePage === 'menu' && (
        <Box sx={{ p: 3 }}>
          {/* Render the product menu */}
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
                <Box key={index}>
                  <Typography>{item.pname}</Typography>
                  {/* Other content */}
                  <Button onClick={() => handleAddToCart(item.pname)}>
                    Add to Cart
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No products available.</Typography>
          )}
        </Box>
      )}

      {/* Render Manager Dashboard if account type is manager */}
      {activePage === 'manager' && <ManagerDashboard />}
    </Box>
  );
}
