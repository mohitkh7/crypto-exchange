import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1a237e', // Dark blue
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#00b0ff', // Light blue
      light: '#69e2ff',
      dark: '#0081cb',
    },
    background: {
      default: '#0a1929', // Very dark blue
      paper: '#1a237e', // Dark blue
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3e5fc',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
  },
}); 