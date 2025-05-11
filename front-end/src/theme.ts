import { createTheme } from '@mui/material/styles';
import { DefaultTheme } from 'styled-components';

export const muiTheme = createTheme({
  palette: {
    primary: { main: '#229D86' },
    secondary: { main: '#40C1B2' },
  },
});

const styledTheme: DefaultTheme = {
  colors: {
    primary: '#229D86',
    secondary: '#40C1B2',
    background: '#f5f5f5',
    text: '#333333',
  },
  muiTheme,
};

export default styledTheme;