import React, { useState } from 'react';
import img from '../../Asserts/Login.jpg'
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
  const newErrors = {
    email: email.trim() === '',
    password: password.trim() === '',
  };
  setErrors(newErrors);

  // If any field has error, don't proceed
  if (newErrors.email || newErrors.password) {
    return;
  }
        console.log(JSON.stringify({ email, password }));
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });  
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('email', data.email);
        localStorage.setItem('password', data.password);
        localStorage.setItem('tenant', data.tenant);
        localStorage.setItem('role', data.role);
        window.location.href = '/home';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
          <Grid container>
            <Grid
              item
              xs={false}
              md={6}
              sx={{
                backgroundImage: `url(${img})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              }}
            />
            <Grid item xs={12} md={6} sx={{ p: 4 }}>
              <Typography component="h1" variant="h5" align="center" gutterBottom>
                Welcome Back
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="email"
                  type="text"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  helperText={errors.email ? 'email is required' : ''}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  helperText={errors.password ? 'Password is required' : ''}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
