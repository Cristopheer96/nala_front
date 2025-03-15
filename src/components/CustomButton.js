// src/components/CustomButton.js
import { Button } from '@mui/material';
import styled from 'styled-components';

const CustomButton = styled(Button)`
  && {
    background-color: #1976d2;
    color: white;
    padding: 12px 0;
    font-size: 1rem;
    &:hover {
      background-color: #115293;
    }
  }
`;

export default CustomButton;
