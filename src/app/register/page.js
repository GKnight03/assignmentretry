'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import validator from 'email-validator';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorHolder, setErrorHolder] = React.useState('');
  const router = useRouter(); // for navigation after registration

  // Validate the form
  const validateForm = (event) => {
    let errorMessage = '';

    // Grab the form data
    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let password = data.get('password');

    // Validate the email
    let emailCheck = validator.validate(email);
    if (!emailCheck) {
      errorMessage += 'Invalid email address. ';
    }

    // Check for empty password
    if (!password) {
      errorMessage += 'Password is required.';
    }

    return errorMessage;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    // Validate the form
    let errorMessage = validateForm(event);
    setErrorHolder(errorMessage);

    // If errors, show the dialog
    if (errorMessage.length > 0) {
      setOpen(true);
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
        setTimeout(() => router.push('/login'), 2000);
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
          🍩 EVIL KRISPY KREME Registration
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
              '&:hover': { backgroundColor: '#d90166' },
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

      {/* Dialog for error message */}
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{errorHolder}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
