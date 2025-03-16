import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import * as XLSX from 'xlsx';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';

function ImportPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Definimos la mutación con React Query
  const importMutation = useMutation(
    (formData) =>
      api.post('/api/v1/leave_requests/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    {
      onSuccess: (data) => {
        setNotification({
          open: true,
          message: 'Importación exitosa',
          severity: 'success',
        });
      },
      onError: (err) => {
        if (err.response && err.response.status === 401) {
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
          const errorMsg =
            err?.response?.data ||
            err?.message ||
            'Error al importar el archivo';
          setNotification({
            open: true,
            message: errorMsg,
            severity: 'error',
          });
        }
      },
    }
  );

  const handleDownloadTemplate = () => {
    const header =
      'User ID\tNombre\tEmail\tLider\tFecha desde\tFecha hasta\tTipo\tMotivo\tEstado\n';
    const blob = new Blob([header], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantilla_vacaciones.xls');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewData([]);
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setPreviewData(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    importMutation.mutate(formData);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setNotification({ open: false, message: '', severity: 'success' });
    window.location.reload(); // Recuerda quitar esto en producción
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Importar Información
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
          mt: 2,
        }}
      >
        {/* Sección para subir archivo */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Subir Documento <br />
              <small>Sólo xlsx</small>
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Seleccionar archivo
              <input
                type="file"
                hidden
                accept=".xlsx"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2">
                Archivo seleccionado:{' '}
                <strong>{selectedFile.name}</strong>
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Sección informativa y descarga de plantilla */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: '#E6F2FE' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon color="primary" sx={{ mr: 1 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold' }}
              >
                Importante
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Descargue la plantilla, unifíquela y realice la carga.
              Los campos en amarillo son obligatorios para hacer la carga.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              No deben haber solapamientos en las fechas de vacaciones/descansos
              con estado Aprobado.
            </Typography>
            <Button
              variant="text"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
            >
              Descargar plantilla
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Sección de Previsualización del Excel */}
      <Box
        sx={{
          mt: 2,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Previsualización
        </Typography>
        {previewData && previewData.length > 0 ? (
          <Box sx={{ overflow: 'auto', maxHeight: 300, mb: 2 }}>
            <Table size="small">
              <TableBody>
                {previewData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {cell !== null && cell !== undefined
                          ? cell.toString()
                          : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography variant="body2">
            Recuerda que los datos deben coincider con el formato de la
            plantilla.
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ mr: 2 }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={!selectedFile}
          >
            Subir Colaboradores
          </Button>
        </Box>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ImportPage;
