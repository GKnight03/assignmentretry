'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // for navigation after registration

  const handleRegister = async () => {
    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/newRegister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setError('');
        setTimeout(() => {
          router.push('/login'); // Redirect to login after 2 seconds
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh', padding: 3 }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6B4226' }}>
          🍩 KRISPY KREME Registration
        </Typography>

        {/* Display Error Message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
            {error}
          </Typography>
        )}

        {/* Display Success Message */}
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
            required
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
            required
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            disabled={isLoading}
            sx={{
              backgroundColor: '#FFB5E8',
              color: '#6B4226',
              marginTop: 2,
              '&:hover': {
                backgroundColor: '#FF9CE8',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#6B4226' }} /> : 'Register'}
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
