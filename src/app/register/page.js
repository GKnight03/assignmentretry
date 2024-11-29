'use client';

import * as React from 'react';
import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Registration successful! You can now log in.');
        setError('');
        // Optionally, redirect to login page after success
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Error occurred while registering. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>Register</Typography>
      {error && <Typography color="red" variant="body2">{error}</Typography>}
      {successMessage && <Typography color="green" variant="body2">{successMessage}</Typography>}
      
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
    </Box>
  );
}
