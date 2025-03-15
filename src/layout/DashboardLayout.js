// src/layout/DashboardLayout.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Collapse
} from '@mui/material';
import { Outlet, Link } from 'react-router-dom'; // Para navegar al hacer clic
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';

// Íconos para expandir/colapsar
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import logoNalaSvg from '../assets/nala-logo.svg';
import logoNalaWhiteSvg from '../assets/nala-white.svg';

const drawerWidth = 240;

function DashboardLayout({ children }) {
  const userName = localStorage.getItem('user_name') || 'Usuario';

  const [open, setOpen] = useState(true);  
  const [anchorEl, setAnchorEl] = useState(null);
  const [vacacionesOpen, setVacacionesOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
    localStorage.removeItem('user_name');
    window.location.href = '/';
  };

  const handleVacacionesClick = () => {
    setVacacionesOpen(!vacacionesOpen);
  };

  const appBarStyles = {
    ml: !isMobile && open ? `${drawerWidth}px` : 0,
    width: !isMobile && open ? `calc(100% - ${drawerWidth}px)` : '100%',
    transition: 'all 0.3s ease',
    backgroundColor: '#2830ff',
  };
  const mainStyles = {
    backgroundColor: '#f0f0f7',
    flexGrow: 1,
    pt: 15,
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
  };
  const drawerVariant = isMobile ? 'temporary' : 'persistent';

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f0f0f7', }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={appBarStyles}>
        <Toolbar>
          {/* Hamburguesa para togglear el sidebar en mobile */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo blanco */}
          <img
            src={logoNalaWhiteSvg}
            alt="Logo Nala"
            style={{ width: '80px', margin: '20px' }}
          />

          <Box sx={{ flexGrow: 1 }} />
          {/* Menú de usuario */}
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleMenuOpen}
            sx={{ fontWeight: 'bold' }}
          >
            {userName}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{ sx: { mt: 1 } }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {userName}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Cerrar Sesión</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer
        variant={drawerVariant}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <img
          src={logoNalaSvg}
          alt="Logo Nala"
          style={{ width: '100%', maxWidth: '150px', margin: '20px' }}
        />

        {/* Opciones de menú */}
        <List>
          {/* 1. Inicio */}
          <ListItem button component={Link} to="/admin/inicio">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>

          {/* 2. Usuarios */}
          <ListItem button component={Link} to="/admin/usuarios">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>

          {/* 3. Gestión de Vacaciones (con subopciones) */}
          <ListItem button onClick={handleVacacionesClick}>
            <ListItemIcon>
              {/* Puedes usar un ícono apropiado, por ejemplo un calendario */}
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Gestión de Vacaciones" />
            {vacacionesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={vacacionesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/vacaciones/importar"
              >
                <ListItemText primary="Importar Información" />
              </ListItem>
              <ListItem
                button
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/vacaciones/solicitar"
              >
                <ListItemText primary="Solicitar Vacaciones" />
              </ListItem>
              <ListItem
                button
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/vacaciones/gestionar"
              >
                <ListItemText primary="Gestionar Vacaciones" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Contenedor padre */}
      <Box component="main" sx={mainStyles}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;
