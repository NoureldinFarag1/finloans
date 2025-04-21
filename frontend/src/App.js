import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ApplyLoanPage from './pages/ApplyLoanPage';
import MyLoansPage from './pages/MyLoansPage';
import MakePaymentPage from './pages/MakePaymentPage';
import LoanDetailPage from './pages/LoanDetailPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/apply-loan" element={
              <ProtectedRoute>
                <Layout>
                  <ApplyLoanPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/my-loans" element={
              <ProtectedRoute>
                <Layout>
                  <MyLoansPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/loans/:loanId" element={
              <ProtectedRoute>
                <Layout>
                  <LoanDetailPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/make-payment/:loanId" element={
              <ProtectedRoute>
                <Layout>
                  <MakePaymentPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Default route - redirects to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
