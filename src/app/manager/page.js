// app/manager/page.js
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
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    fetch('/api/getOrderStatistics') // Fetching order statistics
      .then((res) => res.json())
      .then((data) => setOrderStats(data))
      .catch((error) => console.error('Error fetching order statistics:', error));
  }, []);

  if (!orderStats) return <p>Loading order statistics...</p>;

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
          Order Statistics
        </Typography>

        <Box sx={{ bgcolor: '#333', color: '#fff', padding: 2, borderRadius: 2 }}>
          <Typography variant="h6">
            Total Orders: {orderStats.totalOrders}
          </Typography>
          <Typography variant="h6">
            Total Cost: ${orderStats.totalCost.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
