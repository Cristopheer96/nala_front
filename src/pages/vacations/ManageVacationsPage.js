import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import styled from 'styled-components';
import api from '../../services/api';

const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const StyledBox = styled(Box)`
  width: 90%;
`;

const StyledTableCellHeader = styled(TableCell)`
  background-color: #2830ff;
  font-weight: bold;
  color: white;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #fafafa;
  }
`;

function ManageVacationsPage() {
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const { data, isLoading, isError, refetch } = useQuery(['leaveRequests', page], async () => {
    try {
      const response = await api.get('/api/v1/leave_requests', { params: { page } });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleSessionExpired();
      }
      throw error;
    }
  });

  const handleSessionExpired = () => {
    localStorage.removeItem('access-token');
    setNotification({
      open: true,
      message: 'La sesión ha expirado. Por favor inicia sesión nuevamente.',
      severity: 'error',
    });
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/v1/leave_requests/${id}`, { status: 'aprobado' });
      setNotification({
        open: true,
        message: 'Solicitud aprobada exitosamente.',
        severity: 'success',
      });
      refetch();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleSessionExpired();
      } else {
        setNotification({
          open: true,
          message: 'Error al aprobar la solicitud.',
          severity: 'error',
        });
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/v1/leave_requests/${id}`, { status: 'rechazado' });
      setNotification({
        open: true,
        message: 'Solicitud rechazada exitosamente.',
        severity: 'warning',
      });
      refetch();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleSessionExpired();
      } else {
        setNotification({
          open: true,
          message: 'Error al rechazar la solicitud.',
          severity: 'error',
        });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/leave_requests/${id}`);
      setNotification({
        open: true,
        message: 'Solicitud eliminada exitosamente.',
        severity: 'info',
      });
      refetch();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleSessionExpired();
      } else {
        setNotification({
          open: true,
          message: 'Error al eliminar la solicitud.',
          severity: 'error',
        });
      }
    }
  };

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }

  if (isError) {
    return <Typography>Error al cargar las solicitudes de vacaciones.</Typography>;
  }

  const leaveRequests = data.items;
  const pagination = data.pagination;

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Gestionar Vacaciones
      </Typography>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCellHeader>User ID</StyledTableCellHeader>
              <StyledTableCellHeader>Nombre de Usuario</StyledTableCellHeader>
              <StyledTableCellHeader>Tipo</StyledTableCellHeader>
              <StyledTableCellHeader>Fecha Inicio</StyledTableCellHeader>
              <StyledTableCellHeader>Fecha Fin</StyledTableCellHeader>
              <StyledTableCellHeader>Status</StyledTableCellHeader>
              <StyledTableCellHeader>Líder</StyledTableCellHeader>
              <StyledTableCellHeader>Notas</StyledTableCellHeader>
              <StyledTableCellHeader>Acciones</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests?.map((request) => (
              <StyledTableRow key={request.id}>
                <TableCell>{request.user_id}</TableCell>
                <TableCell>{request.user_name}</TableCell>
                <TableCell>{request.leave_type}</TableCell>
                <TableCell>{request.start_date}</TableCell>
                <TableCell>{request.end_date}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{request.leader_name}</TableCell>
                <TableCell>{request.notes || '-'}</TableCell>
                <TableCell>
                  {request.status === 'pendiente' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleApprove(request.id)}
                        style={{ marginRight: 8 }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleReject(request.id)}
                        style={{ marginRight: 8 }}
                      >
                        Rechazar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(request.id)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {pagination && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </StyledBox>
  );
}

export default ManageVacationsPage;
