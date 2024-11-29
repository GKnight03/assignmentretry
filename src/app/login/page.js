'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simulate login process and check if the user is a customer or manager
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      if (data.user.acc_type === 'manager') {
        // If the user is a manager, navigate to the manager dashboard
        router.push('/manager');
      } else if (data.user.acc_type === 'customer') {
        // If the user is a customer, navigate to the home page or product menu
        router.push('/menu'); // Adjust this based on where you want customers to land
      } else {
        setError('Invalid account type.');
      }
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFF8E7', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
      <Typography variant="h4" sx={{ color: '#6B4226', fontFamily: 'Comic Sans MS, sans-serif', textAlign: 'center' }}>
        Sign In to Krispy Kreme 🍩
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          width: '100%',
          padding: 3,
          backgroundColor: '#FFB5E8',
          borderRadius: 2,
          boxShadow: 3,
          mt: 3,
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ backgroundColor: 'white' }}
        />
        {error && (
          <Typography color="error" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: '#6B4226',
            '&:hover': { backgroundColor: '#9F5E4A' },
            fontWeight: 'bold',
          }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
}
