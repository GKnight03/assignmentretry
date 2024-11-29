'use client';

import { useState } from 'react'; // useState is now safe to use
import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router'
import { Box, Button, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // This is the correct way to handle navigation in Next.js 13

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send login request
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      if (data.user && data.user.acc_type === 'manager') {
        // Redirect to manager dashboard
        router.push('/manager');
      } else if (data.user && data.user.acc_type === 'customer') {
        // Redirect to the menu for customers
        router.push('/menu');
      } else {
        setError('Invalid account type.');
      }
    } else {
      setError(data.message || 'Invalid email or password.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2, mt: 5 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6B4226' }}>
          🍩 KRISPY KREME Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
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
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#FFB5E8',
              color: '#6B4226',
              marginTop: 2,
              '&:hover': {
                backgroundColor: '#FF9CE8',
              },
            }}
          >
            Log In
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Typography variant="body2" sx={{ color: '#6B4226' }}>
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
