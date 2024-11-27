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

export default function RegisterPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event) => {
    console.log("handling submit");
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let email = data.get('email');
    let pass = data.get('pass');
    let address = data.get('address');

    console.log("Sent email:" + email);
    console.log("Sent pass:" + pass);
    console.log("Sent address:" + address);

    setLoading(true);
    setError('');
    setSuccess(false);

    // Use relative API path instead of localhost URL
    const apiUrl = `/api/newRegister?email=${email}&pass=${pass}&address=${address}`;

    runDBCallAsync(apiUrl);
  };

  async function runDBCallAsync(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.data === "valid") {
        setSuccess(true);
      } else {
        setError("Registration failed. Please try again.");
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
            Krispy Kreme - Register
          </Typography>

          {success && (
            <Typography variant="h6" color="green" sx={{ textAlign: 'center', mb: 2 }}>
              Welcome to Krispy Kreme!
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

          <TextField
            margin="normal"
            required
            fullWidth
            name="address"
            label="Home Address"
            type="text"
            id="address"
            autoComplete="current-address"
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
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          {loading && (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              Please wait while we glaze your account.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
