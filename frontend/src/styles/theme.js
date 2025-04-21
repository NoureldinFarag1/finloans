import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2451B7', // Deep blue for primary actions
      light: '#5D7CF2',
      dark: '#0D326F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#19857b', // Teal for secondary actions
      light: '#4CB6AC',
      dark: '#00574B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#3AA76D', // Green for success states
      light: '#6BD99C',
      dark: '#007741',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E53935', // Red for errors
      light: '#FF6B67',
      dark: '#AB000D',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFC107', // Amber for warnings
      light: '#FFF350',
      dark: '#C79100',
      contrastText: '#000000',
    },
    info: {
      main: '#2196F3', // Light blue for info
      light: '#64B5F6',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212B36',
      secondary: '#5E6A78',
      disabled: '#A0AEC0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(31, 41, 55, 0.06)',
    '0px 4px 6px rgba(31, 41, 55, 0.1)',
    '0px 6px 8px rgba(31, 41, 55, 0.12)',
    '0px 8px 12px rgba(31, 41, 55, 0.14)',
    '0px 12px 16px rgba(31, 41, 55, 0.16)',
    '0px 16px 24px rgba(31, 41, 55, 0.18)',
    '0px 20px 28px rgba(31, 41, 55, 0.2)',
    '0px 24px 32px rgba(31, 41, 55, 0.22)',
    '0px 28px 36px rgba(31, 41, 55, 0.24)',
    '0px 32px 40px rgba(31, 41, 55, 0.26)',
    '0px 36px 44px rgba(31, 41, 55, 0.28)',
    '0px 40px 48px rgba(31, 41, 55, 0.3)',
    '0px 44px 52px rgba(31, 41, 55, 0.32)',
    '0px 48px 56px rgba(31, 41, 55, 0.34)',
    '0px 52px 60px rgba(31, 41, 55, 0.36)',
    '0px 56px 64px rgba(31, 41, 55, 0.38)',
    '0px 60px 68px rgba(31, 41, 55, 0.4)',
    '0px 64px 72px rgba(31, 41, 55, 0.42)',
    '0px 68px 76px rgba(31, 41, 55, 0.44)',
    '0px 72px 80px rgba(31, 41, 55, 0.46)',
    '0px 76px 84px rgba(31, 41, 55, 0.48)',
    '0px 80px 88px rgba(31, 41, 55, 0.5)',
    '0px 84px 92px rgba(31, 41, 55, 0.52)',
    '0px 88px 96px rgba(31, 41, 55, 0.54)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(31, 41, 55, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;