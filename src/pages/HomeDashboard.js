// src/pages/HomeDashboard.js
import React from 'react';
import { Typography } from '@mui/material';

function HomeDashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido al Dashboard!
      </Typography>
      <Typography variant="body1">
        Aquí puedes ver tus estadísticas, administrar usuarios, etc.
      </Typography>
    </div>
  );
}

export default HomeDashboard;
