import React, { useState, useMemo } from 'react';
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
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Button
} from '@mui/material';
import styled from 'styled-components';
import api from '../../services/api';

const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
const StyledBox = styled(Box)`
  width: 90%;
  margin: auto;
  padding: 16px;
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

//Heere constants could be implemented to avoid 'magic numbers/strings,' but for now, it will be left as this
function getProgressColor(totalDays) {
  if (totalDays < 10) return 'error';
  if (totalDays < 20) return 'warning';
  return 'success';
}

function LeaveAnalyticsPage() {
  const [page, setPage] = useState(1);
  const [leaderName, setLeaderName] = useState('');
  const [name, setName] = useState('');
  const [dateRange, setDateRange] = useState('2024'); // opción por defecto
  // Filtro para ordenar por días si se usa esa opción
  const [sortDays, setSortDays] = useState('desc');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Función para mapear la opción de fecha a un rango concreto
  const getDateRange = (range) => {
    if (range === '2022') {
      return { start_date: '2022-01-01', end_date: '2022-12-31' };
    } else if (range === '2024') {
      return { start_date: '2024-01-01', end_date: '2024-12-31' };
    } else if (range === '2025') {
      const currentDate = new Date();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dd = String(currentDate.getDate()).padStart(2, '0');
      return { start_date: '2025-01-01', end_date: `${yyyy}-${mm}-${dd}` };
    }
    return { start_date: '', end_date: '' };
  };

  const { start_date, end_date } = getDateRange(dateRange);

  // Calculamos dinámicamente el order_by según los filtros escritos.
  const computedOrderBy = useMemo(() => {
    if (name.trim()) return 'u.name';
    if (leaderName.trim()) return 'u.leader_name';
    return 'total_days';
  }, [name, leaderName]);

  // Para el parámetro "order": si ordenamos por total_days se usa el valor de sortDays;
  // para ordenamiento por nombre o líder se asume ascendente.
  const computedOrder = computedOrderBy === 'total_days' ? sortDays : 'asc';

  // Consulta a la API
  const { data, isLoading, isError, refetch } = useQuery(
    ['leaveAnalytics', page, leaderName, name, dateRange, sortDays],
    async () => {
      try {
        const response = await api.get('/api/v1/leave_requests/analytics', {
          params: {
            page,
            per_page: 10,
            leader_name: leaderName,
            name,
            start_date,
            end_date,
            order_by: computedOrderBy,
            order: computedOrder,
          },
        });
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
    },
    { keepPreviousData: true }
  );

  if (isLoading) return <Typography>Cargando...</Typography>;
  if (isError) return <Typography>Error al cargar datos.</Typography>;

  const analytics = data.query;
  const totalCount = data.total;
  const totalPages = Math.ceil(totalCount / data.per_page);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleLeaderNameChange = (event) => {
    setLeaderName(event.target.value);
    setPage(1);
    refetch();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setPage(1);
    refetch();
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    setPage(1);
    refetch();
  };

  const handleSortDaysChange = (event) => {
    setSortDays(event.target.value);
    setPage(1);
    refetch();
  };

  const handleNotifyLeader = (row) => {
    // Here the real logic could be implemented for now we just display a message in the notification.
    setNotification({
      open: true,
      message: `Se ha avisado al líder de ${row.name} (líder: ${row.leader_name}).`,
      severity: 'success',
    });
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Analytics de Vacaciones
      </Typography>

      {/* Filtros */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Nombre del Usuario"
          value={name}
          onChange={handleNameChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Nombre del Líder"
          value={leaderName}
          onChange={handleLeaderNameChange}
          variant="outlined"
          size="small"
        />
        <FormControl variant="outlined" size="small">
          <InputLabel id="date-range-label">Rango de Fechas</InputLabel>
          <Select
            labelId="date-range-label"
            value={dateRange}
            onChange={handleDateRangeChange}
            label="Rango de Fechas"
          >
            <MenuItem value="2022">01-01-2022 / 31-12-2022</MenuItem>
            <MenuItem value="2024">01-01-2024 / 31-12-2024</MenuItem>
            <MenuItem value="2025">01-01-2025 / Fecha actual</MenuItem>
          </Select>
        </FormControl>
        {/* Filtro para ordenar por total_days solo se aplica si no se usa un filtro de nombre o líder */}
        {computedOrderBy === 'total_days' && (
          <FormControl variant="outlined" size="small">
            <InputLabel id="sort-days-label">Ordenar Días Descansados</InputLabel>
            <Select
              labelId="sort-days-label"
              value={sortDays}
              onChange={handleSortDaysChange}
              label="Ordenar Días Descansados"
            >
              <MenuItem value="desc">Mayor a menor</MenuItem>
              <MenuItem value="asc">Menor a mayor</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCellHeader>Nombre</StyledTableCellHeader>
              <StyledTableCellHeader>Correo</StyledTableCellHeader>
              <StyledTableCellHeader>Líder</StyledTableCellHeader>
              <StyledTableCellHeader>Días Descansados</StyledTableCellHeader>
              <StyledTableCellHeader>Visual</StyledTableCellHeader>
              <StyledTableCellHeader>Acciones</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics?.map((row) => {
              const percentage = Math.min((row.total_days / 30) * 100, 100);
              return (
                <StyledTableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email || 'Sin correo'}</TableCell>
                  <TableCell>{row.leader_name || 'Sin líder'}</TableCell>
                  <TableCell>{row.total_days}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box width={130}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={getProgressColor(row.total_days)}
                          sx={{ height: 12, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="caption">
                        {Math.min(row.total_days, 30)} / 30
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNotifyLeader(row)}
                    >
                      Avisar al líder
                    </Button>
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
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

export default LeaveAnalyticsPage;
