import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function HomePage() {
  const email = localStorage.getItem('uid');
  const name = localStorage.getItem('user_name');
  const leaderName = localStorage.getItem('leader_name') || 'No asignado';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '30vh',
        backgroundColor: '#f0f2f5',
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}
        >
          Información del Usuario
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Nombre:</strong> {name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Líder:</strong> {leaderName}
        </Typography>
      </Paper>
    </Box>
  );
}

export default HomePage;
