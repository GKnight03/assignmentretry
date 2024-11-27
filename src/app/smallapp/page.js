'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';

export default function KrispyKremeApp() {
  // State for controlling what page to show
  const [showLogin, setShowLogin] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);

  // State for storing product data
  const [data, setData] = useState(null);

  // Fetch products when the Dashboard is displayed
  useEffect(() => {
    if (showDash) {
      fetch('http://localhost:3000/api/getProducts')
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }
  }, [showDash]);

  // Function for adding items to the shopping cart
  function putInCart(pname) {
    console.log("Adding to cart: " + pname);

    fetch("http://localhost:3000/api/putInCart?pname=" + pname)
      .then((response) => response.json())
      .then((data) => {
        console.log('Item added to cart:', data);
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
      });
  }

  // Functions to show different pages
  function runShowLogin() {
    setShowFirstPage(false);
    setShowLogin(true);
    setShowDash(false);
  }

  function runShowDash() {
    setShowFirstPage(false);
    setShowLogin(false);
    setShowDash(true);
  }

  function runShowFirst() {
    setShowFirstPage(true);
    setShowLogin(false);
    setShowDash(false);
  }

  // Display a loading message if data hasn't been fetched yet
  if (!data && showDash) return <p>Loading...</p>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#D62300' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'KrispyKremeFont, sans-serif' }}>
            Krispy Kreme Dashboard
          </Typography>
          <Button color="inherit" onClick={runShowFirst}>Home</Button>
          <Button color="inherit" onClick={runShowLogin}>Sign In</Button>
          <Button color="inherit" onClick={runShowDash}>Menu</Button>
        </Toolbar>
      </AppBar>

      {showFirstPage && (
        <Box
          component="section"
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: '#FFF8E6',
            border: '2px dashed #00653A',
            fontFamily: 'KrispyKremeFont, sans-serif',
          }}
        >
          <Typography variant="h4" color="#00653A">
            Back At It Again at Krispy Kreme!
          </Typography>
          <Typography>
            Enjoy the Kreme of the crop!
          </Typography>
        </Box>
      )}

      {showLogin && (
        <Box
          component="section"
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: '#FFF8E6',
            border: '2px dashed #D62300',
            fontFamily: 'KrispyKremeFont, sans-serif',
          }}
        >
          <Typography variant="h4" color="#D62300">
            Sign In
          </Typography>
          <Typography>
            Please log in to access exclusive deals and offers.
          </Typography>
        </Box>
      )}

      {showDash && (
        <Box
          component="section"
          sx={{
            p: 3,
            bgcolor: '#FFF8E6',
            border: '2px dashed #00653A',
          }}
        >
          <Typography variant="h5" color="#00653A">
            Donut Time
          </Typography>
          {data ? (
            data.map((item, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid #D62300',
                  borderRadius: 2,
                  textAlign: 'center',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Typography variant="h6">{item.pname}</Typography>
                <Typography variant="body2">Price: ${item.price}</Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#00653A',
                    color: '#FFFFFF',
                    ':hover': { bgcolor: '#004225' },
                  }}
                  onClick={() => putInCart(item.pname)}
                >
                  Add to Cart
                </Button>
              </Box>
            ))
          ) : (
            <p>Loading Donuts...</p>
          )}
        </Box>
      )}
    </Box>
  );
}
