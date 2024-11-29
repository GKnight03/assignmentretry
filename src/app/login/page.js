'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user && data.user.acc_type === 'manager') {
          setTimeout(() => router.push('/manager'), 500);
        } else if (data.user && data.user.acc_type === 'customer') {
          setTimeout(() => router.push('/smallapp'), 500);
        } else {
          setError('Invalid account type.');
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setError('An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#3E3B3D', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2, mt: 5 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#FF0000' }}>
          🍩 EVIL KRISPY KREME Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginTop: 2, color: '#FF0000' }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
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
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              backgroundColor: '#FF0000',
              color: '#FFF',
              marginTop: 2,
              '&:hover': {
                backgroundColor: '#FF5C5C',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#6B4226' }} /> : 'Log In'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Typography variant="body2" sx={{ color: '#FF0000' }}>
            Don't have an account?{' '}
            <Button
              onClick={() => router.push('/register')}
              sx={{ color: '#FFB5E8', textDecoration: 'underline' }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
