import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert as MuiAlert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import api from '../../services/api';

const StyledButton = styled(Button)`
  margin-top: 16px;
`;

function RequestPage() {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    notes: '',
    leave_type: 'vacaciones',
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const mutation = useMutation(
    (newRequest) => api.post('/api/v1/leave_requests', newRequest),
    {
      onSuccess: () => {
        setNotification({
          open: true,
          message: 'Solicitud creada exitosamente',
          severity: 'success',
        });
        setFormData({
          start_date: '',
          end_date: '',
          notes: '',
          leave_type: 'vacaciones',
        });
      },
      onError: (error) => {
        let errorMsg = 'Error al crear la solicitud';
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('access-token');
          setNotification({
            open: true,
            message:
              'La sesión ha expirado. Por favor inicia sesión nuevamente.',
            severity: 'error',
          });
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          errorMsg =
            error?.response?.data ||
            error?.message ||
            'Error al importar el archivo';
          setNotification({
            open: true,
            message: errorMsg,
            severity: 'error',
          });
        }
      }
    }
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ leave_request: formData });
  };

  return (
    <Box sx={{ p: 8, backgroundColor: 'white', height: '60vh', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Solicitar Vacaciones / Incapacidad
      </Typography>
      <Typography>
        Aquí puedes llenar un formulario para solicitar vacaciones o incapacidad.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Fecha de Inicio"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Fin"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Motivo"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Tipo</InputLabel>
          <Select
            labelId="type-label"
            name="leave_type"
            value={formData.leave_type}
            label="Tipo"
            onChange={handleChange}
          >
            <MenuItem value="vacaciones">Vacaciones</MenuItem>
            <MenuItem value="incapacidad">Incapacidad</MenuItem>
          </Select>
        </FormControl>
        <StyledButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formData.start_date || !formData.end_date || !formData.leave_type}
        >
          Enviar Solicitud
        </StyledButton>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <MuiAlert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default RequestPage;
