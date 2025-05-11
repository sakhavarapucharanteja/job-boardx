import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CssBaseline } from '@mui/material';
import App from './App';
import theme from './theme';
import GlobalStyles from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <BrowserRouter>
      <AuthProvider>
      <App />
      </AuthProvider>
        
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);