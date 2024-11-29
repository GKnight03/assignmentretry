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
import { useRouter } from 'next/navigation'; // For navigation

export default function ManagerDashboard() {
  const [orderStats, setOrderStats] = useState(null);
  const [orders, setOrders] = useState([]); // State to hold orders
  const router = useRouter();

  // Fetch order statistics and orders when the component mounts
  useEffect(() => {
    // Fetch order statistics
    fetch('/api/getOrderStatistics')
      .then((res) => res.json())
      .then((data) => setOrderStats(data))
      .catch((error) => console.error('Error fetching order statistics:', error));

    // Fetch order details
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  // If orderStats or orders are not available yet, display a loading message
  if (!orderStats || orders.length === 0) return <p>Loading...</p>;

  // Log out handler (if needed for your app)
  const handleLogout = () => {
    // Implement logout functionality (clearing session or tokens)
    router.push('/login'); // Redirect to login page after logging out
  };

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
          <Button color="inherit" onClick={handleLogout}>Log Out</Button>
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

      <Box sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" color="#ff0000" sx={{ textAlign: 'center', mb: 2 }}>
          All Orders
        </Typography>

        {/* Render the list of orders */}
        <Box sx={{ overflowY: 'scroll', maxHeight: '400px', bgcolor: '#333', color: '#fff', padding: 2, borderRadius: 2 }}>
          {orders.map((order) => (
            <Box key={order._id} sx={{ mb: 2, padding: 2, borderBottom: '1px solid #fff' }}>
              <Typography variant="h6">Order ID: {order._id}</Typography>
              <Typography variant="body1">Customer: {order.customerEmail}</Typography>
              <Typography variant="body1">Placed at: {new Date(order.createdAt).toLocaleString()}</Typography>
              <Typography variant="body2">Status: {order.status}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Items:</Typography>
                {order.items.map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item.pname} - ${item.price.toFixed(2)}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
