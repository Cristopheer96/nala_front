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
  Snackbar,
  Alert
} from '@mui/material';
import styled from 'styled-components';
import api from '../services/api';

const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

function UsersPage() {
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const { data, isLoading, isError } = useQuery(['users', page], async () => {
    try {
      const response = await api.get('/api/v1/users', { params: { page } });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('access-token');
        setNotification({
          open: true,
          message: 'La sesión ha expirado. Por favor inicia sesión nuevamente.',
          severity: 'error',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
      throw error;
    }
  });

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }

  if (isError) {
    return <Typography>Error al cargar usuarios.</Typography>;
  }

  const users = data.users;
  const pagination = data.pagination;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Listado de Usuarios
      </Typography>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCellHeader>Nombre</StyledTableCellHeader>
              <StyledTableCellHeader>Email</StyledTableCellHeader>
              <StyledTableCellHeader>Líder</StyledTableCellHeader>
              <StyledTableCellHeader>ID Interno</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>{user.name || 'Sin nombre'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.leader_name}</TableCell>
                <TableCell>{user.internal_id}</TableCell>
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

      {/* Notificación de error */}
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

export default UsersPage;
