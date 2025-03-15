import fondoSvg from '../assets/background_login.svg';
import ilustracionSvg from '../assets/people.svg';
import logoNalaSvg from '../assets/nala-logo.svg';
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Container,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '../services/auth';
import CustomButton from '../components/CustomButton';

const AuthPage = () => {
  const [toggleForm, setToggleForm] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useMutation(loginUser, {
    onSuccess: (result) => {
      const { data, headers } = result;
      localStorage.setItem('access-token', headers['access-token']);
      localStorage.setItem('client', headers['client']);
      localStorage.setItem('uid', headers['uid']);
      localStorage.setItem('user_name', data.data.name);
      window.location.href = '/admin';
    },
    onError: (error) => {
      setErrorMsg('Error al iniciar sesión. Revisa tus credenciales.');
      console.error('Error de login', error);
    },
  });

  const registerMutation = useMutation(registerUser, {
    onSuccess: (data) => {
      setToggleForm('login');
    },
    onError: (error) => {
      setErrorMsg('Error al registrarse. Revisa tus datos.');
      console.error('Error de registro', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (toggleForm === 'login') {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* LEft Seccion */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#1E1E1E',
          color: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          px: 12,
          backgroundImage: `url(${fondoSvg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Descubre y potencia tu talento
        </Typography>
        <Typography variant="h5" gutterBottom>
          Descubre las herramientas que necesitas para llegar al siguiente nivel
        </Typography>
        <img src={ilustracionSvg} alt="Ilustración" style={{ width: '100%'}} />

      </Grid>

      {/* Right Section */}

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Container maxWidth="sm">
          <img src={logoNalaSvg} alt="Ilustración" style={{ width: '100%', maxWidth: '100px', marginBottom: '36px' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3 }}>
              {toggleForm === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </Typography>

            {errorMsg && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: '100%' }}
            >
              {toggleForm === 'register' && (
                <TextField
                  label="Nombre"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Contraseña"
                fullWidth
                margin="normal"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Box sx={{ mt: 3 }}>
                <CustomButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={
                    toggleForm === 'login'
                      ? loginMutation.isLoading
                      : registerMutation.isLoading
                  }
                >
                  {toggleForm === 'login'
                    ? loginMutation.isLoading
                      ? 'Cargando...'
                      : 'Ingresar'
                    : registerMutation.isLoading
                      ? 'Registrando...'
                      : 'Registrarse'}
                </CustomButton>
              </Box>
            </Box>

            {/* Toggle button  */}
            <Box sx={{ mt: 3 }}>
              {toggleForm === 'login' ? (
                <Typography variant="body2">
                  ¿No tienes cuenta?{' '}
                  <Link
                    href="#"
                    onClick={() => {
                      setToggleForm('register');
                      setErrorMsg('');
                    }}
                  >
                    Regístrate
                  </Link>
                </Typography>
              ) : (
                <Typography variant="body2">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    href="#"
                    onClick={() => {
                      setToggleForm('login');
                      setErrorMsg('');
                    }}
                  >
                    Inicia sesión
                  </Link>
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
