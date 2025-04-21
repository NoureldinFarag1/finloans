import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Container, 
  Alert, CircularProgress, Divider, Button,
  Card, CardContent, Chip, LinearProgress, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { loanService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

const LoanDetailPage = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const { currentUser } = useAuth();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await loanService.getLoanById(loanId);
        setLoan(response.data);
      } catch (err) {
        console.error('Error fetching loan details:', err);
        setError('Failed to load loan details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchLoanDetails();
    }
  }, [loanId]);

  // Go back to loans list
  const handleGoBack = () => {
    navigate('/my-loans');
  };

  // Navigate to payment page
  const handleMakePayment = () => {
    navigate(`/make-payment/${loanId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!loan || !loan.start_date || !loan.end_date) return 0;
    
    const startDate = new Date(loan.start_date);
    const endDate = new Date(loan.end_date);
    const today = new Date();
    
    // Calculate progress percentage
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    return Math.min(Math.max(Math.floor((elapsed / totalDuration) * 100), 0), 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!loan) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Loan not found or you don't have permission to view it.
      </Alert>
    );
  }

  const progress = calculateProgress();

  return (
    <Container>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
          sx={{ mr: 2 }}
        >
          Back to Loans
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Loan #{loan.id}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Loan Details
              </Typography>
              <Chip
                icon={loan.approved ? <CheckCircleIcon /> : <CancelIcon />}
                label={loan.approved ? 'Approved' : 'Pending'}
                color={loan.approved ? 'success' : 'warning'}
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Loan Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  ${parseFloat(loan.amount).toFixed(2)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Interest Rate
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {loan.interest_rate}%
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {Math.ceil((new Date(loan.end_date) - new Date(loan.start_date)) / (1000 * 60 * 60 * 24 * 30))} months
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(loan.start_date)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(loan.end_date)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Application Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(loan.application_date)}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Loan Progress ({progress}%)
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            
            {loan.approved && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PaymentIcon />}
                onClick={handleMakePayment}
                sx={{ mt: 4 }}
              >
                Make a Payment
              </Button>
            )}
          </Paper>
          
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Payment Schedule
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment #</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Sample payment schedule - would be dynamically generated */}
                    {[...Array(5)].map((_, index) => {
                      const dueDate = new Date(loan.start_date);
                      dueDate.setMonth(dueDate.getMonth() + index + 1);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{formatDate(dueDate)}</TableCell>
                          <TableCell>${(parseFloat(loan.amount) / 12).toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              size="small"
                              label={index === 0 ? "Paid" : "Upcoming"} 
                              color={index === 0 ? "success" : "default"}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Loan Summary
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Principal
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    ${parseFloat(loan.amount).toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Interest
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    ${(parseFloat(loan.amount) * loan.interest_rate / 100).toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Repayment
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    ${(parseFloat(loan.amount) * (1 + loan.interest_rate / 100)).toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Payment
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold" color="primary.main">
                    ${(parseFloat(loan.amount) * (1 + loan.interest_rate / 100) / 12).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Loan Parties
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Loan Provider
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {loan.provider?.name || 'Unknown Provider'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {loan.customer?.name || 'Unknown Customer'}
                </Typography>
              </Box>
              
              {loan.approved && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Approved By
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    Bank Admin
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoanDetailPage;