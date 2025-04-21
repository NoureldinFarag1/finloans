import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Typography, Paper, 
  Container, Alert, CircularProgress, Grid,
  Card, CardContent, Divider, InputAdornment
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loanService } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';

const MakePaymentPage = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingLoan, setLoadingLoan] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loan, setLoan] = useState(null);

  // Fetch loan data
  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await loanService.getLoanById(loanId);
        setLoan(response.data);
      } catch (err) {
        console.error('Error fetching loan details:', err);
        setError('Failed to load loan details. Please try again later.');
      } finally {
        setLoadingLoan(false);
      }
    };

    if (loanId) {
      fetchLoan();
    }
  }, [loanId]);

  // Form validation schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .min(1, 'Minimum payment amount is $1')
      .max(loan?.amount || 100000, 'Payment cannot exceed loan amount'),
    date: Yup.date()
      .required('Payment date is required')
      .max(new Date(), 'Payment date cannot be in the future')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amount: '',
      date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await loanService.makePayment(loanId, values);
        setSuccess('Payment submitted successfully!');
        setTimeout(() => {
          navigate('/my-loans');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to submit payment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  if (loadingLoan) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loan) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Loan not found or you don't have permission to access it.
      </Alert>
    );
  }

  if (!loan.approved) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        This loan is not yet approved. Payments can only be made on approved loans.
      </Alert>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Make a Payment
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
            }}
          >
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <TextField
                fullWidth
                id="amount"
                name="amount"
                label="Payment Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Payment Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Make Payment'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Summary
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Loan ID
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    #{loan.id}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Original Amount
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    ${parseFloat(loan.amount).toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    {loan.interest_rate}%
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Outstanding Balance
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold" color="error.main">
                    ${parseFloat(loan.amount).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Previous Payments Card */}
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              mt: 2
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Previous Payments
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No previous payments recorded for this loan.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MakePaymentPage;