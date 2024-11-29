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

export default function ManagerDashboard() {
  const [cartItems, setCartItems] = useState(null);

  useEffect(() => {
    fetch('/api/getCartItems') // Fetching items from shopping_cart collection
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((error) => console.error('Error fetching cart items:', error));
  }, []);

  if (!cartItems) return <p>Loading cart items...</p>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#1A1A1A' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ff0000' }}>
            Evil Krispy Kreme - Manager Dashboard
          </Typography>
          <Button color="inherit">Log Out</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, bgcolor: '#2c2c2c', border: '2px dashed #ff0000', borderRadius: 2 }}>
        <Typography variant="h5" color="#ff0000" sx={{ textAlign: 'center', mb: 2 }}>
          Shopping Cart Items
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', color: '#fff' }}>
            <thead>
              <tr>
                <th style={{ color: '#ff0000' }}>Product Name</th>
                <th style={{ color: '#ff0000' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={i} style={{ backgroundColor: '#333' }}>
                  <td>{item.pname}</td>  {/* Product Name */}
                  <td>{item.quantity}</td>  {/* Quantity */}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
}
