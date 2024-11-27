'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event) => {
    console.log("handling submit");
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let email = data.get('email');
    let pass = data.get('pass');

    console.log("Sent email:" + email);
    console.log("Sent pass:" + pass);

    setLoading(true);
    setError('');
    setSuccess(false);

    // API URL for login
    const apiUrl = '/api/login'; 
    const bodyData = { email, pass };

    runDBCallAsync(apiUrl, bodyData);
  };

  async function runDBCallAsync(url, bodyData) {
    try {
      const res = await fetch(url, {
        method: 'GET', // Assuming you are using a GET request based on your route
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (data.data === 'true') {
        setSuccess(true);
      } else {
        setError("Invalid login credentials. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '100vh' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 1,
            bgcolor: '#FFF8E6',
            border: '2px dashed #D62300',
            p: 3,
            fontFamily: 'KrispyKremeFont, sans-serif',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" color="#D62300" sx={{ textAlign: 'center', mb: 2 }}>
            Krispy Kreme - Login
          </Typography>

          {success && (
            <Typography variant="h6" color="green" sx={{ textAlign: 'center', mb: 2 }}>
              Welcome back to Krispy Kreme!
            </Typography>
          )}

          {error && (
            <Typography variant="h6" color="red" sx={{ textAlign: 'center', mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Password"
            type="password"
            id="pass"
            autoComplete="current-password"
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#00653A',
              ':hover': { bgcolor: '#004225' },
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {loading && (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              Please wait while we glaze your account.
            </Typography>
          )}

          <Link href="#" variant="body2" sx={{ textAlign: 'center', display: 'block', mt: 2 }}>
            Forgot your password? Click here.
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
