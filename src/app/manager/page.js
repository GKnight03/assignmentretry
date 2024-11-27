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
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch('/api/getOrders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders))
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  if (!orders) return <p>Loading orders</p>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#1A1A1A' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Creepster, sans-serif', color: '#ff0000' }}>
            Evil Krispy Kreme - Manager Dashboard
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Log Out</Button>
        </Toolbar>
      </AppBar>

      <Box component="section" sx={{ p: 3, bgcolor: '#2c2c2c', border: '2px dashed #ff0000', borderRadius: 2 }}>
        <Typography variant="h5" color="#ff0000" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Creepster, sans-serif' }}>
          Orders List - The Dark Order
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', color: '#fff', fontFamily: 'Creepster, sans-serif' }}>
            <thead>
              <tr>
                <th style={{ color: '#ff0000' }}>Order ID</th>
                <th style={{ color: '#ff0000' }}>Customer</th>
                <th style={{ color: '#ff0000' }}>Products</th>
                <th style={{ color: '#ff0000' }}>Order Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} style={{ backgroundColor: '#333' }}>
                  <td>{order.orderID}</td>
                  <td>{order.customer}</td>
                  <td>{order.products.join(', ')}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
}
