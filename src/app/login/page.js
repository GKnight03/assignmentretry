'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material'; // Import necessary Material UI components

export default function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accType, setAccType] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const apiUrl = '/api/login';
    const bodyData = { email, password };

    runDBCallAsync(apiUrl, bodyData);
  };

  async function runDBCallAsync(url, bodyData) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setAccType(data.acc_type); // Set the account type after successful login
        onLoginSuccess(); // Call parent function to navigate to the dashboard
      } else {
        setError('Invalid login credentials. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleFetchOrders = async () => {
    try {
      const response = await fetch('/api/getOrders');
      const data = await response.json();

      if (response.ok) {
        console.log('Orders:', JSON.stringify(data.orders, null, 2)); // Print orders as JSON with formatting
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Email Field */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}

        {/* Success Message */}
        {success && (
          <Typography color="success" variant="body2" sx={{ marginTop: 2 }}>
            Login successful! Redirecting...
          </Typography>
        )}

        {/* Manager Button */}
        {accType === 'manager' && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFetchOrders}
            sx={{ marginTop: 2 }}
          >
            View Orders
          </Button>
        )}
      </Box>
    </Container>
  );
}
