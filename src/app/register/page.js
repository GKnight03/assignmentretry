'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // for navigation after registration

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
        // Redirect to login page after successful registration
        setTimeout(() => router.push('/login'), 2000); // Optional redirect after 2 seconds
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Error occurred while registering. Please try again.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh', padding: 3 }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6B4226' }}>
          🍩 KRISPY KREME Registration
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="body2" color="success" sx={{ textAlign: 'center', marginTop: 2 }}>
            {successMessage}
          </Typography>
        )}

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            sx={{
              backgroundColor: '#FFB5E8',
              color: '#6B4226',
              marginTop: 2,
              '&:hover': {
                backgroundColor: '#FF9CE8',
              },
            }}
          >
            Register
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Typography variant="body2" sx={{ color: '#6B4226' }}>
            Already have an account?{' '}
            <Button
              onClick={() => router.push('/login')}
              sx={{ color: '#FFB5E8', textDecoration: 'underline' }}
            >
              Log In
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
