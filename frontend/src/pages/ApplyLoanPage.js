import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Typography, Paper, 
  Container, Alert, CircularProgress, Slider, Grid,
  Card, CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loanService, loanParametersService } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ApplyLoanPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loanParameters, setLoanParameters] = useState({
    min_amount: 100,
    max_amount: 10000,
    min_interest_rate: 5,
    max_interest_rate: 15,
    min_duration: 3,
    max_duration: 60
  });
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // Fetch loan parameters
    const fetchLoanParameters = async () => {
      try {
        const response = await loanParametersService.getParameters();
        if (response.data && response.data.length > 0) {
          setLoanParameters(response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching loan parameters:', err);
      }
    };

    fetchLoanParameters();
  }, []);

  // Calculate monthly payment
  const calculateMonthlyPayment = (amount, interestRate, duration) => {
    // Monthly interest rate
    const r = interestRate / 100 / 12;
    // Number of payments
    const n = duration;
    // Monthly payment formula: P = (r*A) / (1 - (1+r)^-n)
    // where P is payment, A is amount, r is interest rate, n is duration
    if (r === 0) return amount / n;
    const payment = (r * amount) / (1 - Math.pow(1 + r, -n));
    return payment;
  };

  // Form validation schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .min(loanParameters.min_amount, `Minimum amount is $${loanParameters.min_amount}`)
      .max(loanParameters.max_amount, `Maximum amount is $${loanParameters.max_amount}`),
    term: Yup.number()
      .required('Term is required')
      .min(loanParameters.min_duration, `Minimum term is ${loanParameters.min_duration} months`)
      .max(loanParameters.max_duration, `Maximum term is ${loanParameters.max_duration} months`),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amount: loanParameters.min_amount,
      term: loanParameters.min_duration,
      interestRate: loanParameters.min_interest_rate,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await loanService.applyForLoan(values);
        setSuccess('Loan application submitted successfully!');
        setTimeout(() => {
          navigate('/my-loans');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to submit loan application. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  // Update calculations when form values change
  useEffect(() => {
    const { amount, term, interestRate } = formik.values;
    const monthly = calculateMonthlyPayment(amount, interestRate, term);
    setMonthlyPayment(monthly);
    setTotalPayment(monthly * term);
  }, [formik.values]);

  if (!currentUser || currentUser.role !== 'LC') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          You must be logged in as a loan customer to apply for a loan.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Apply for a Loan
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
                Loan Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography gutterBottom>
                Loan Amount: ${formik.values.amount}
              </Typography>
              <Slider
                name="amount"
                value={formik.values.amount}
                onChange={(_, value) => formik.setFieldValue('amount', value)}
                min={loanParameters.min_amount}
                max={loanParameters.max_amount}
                step={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                sx={{ mb: 4 }}
              />
              
              <Typography gutterBottom>
                Loan Term: {formik.values.term} months
              </Typography>
              <Slider
                name="term"
                value={formik.values.term}
                onChange={(_, value) => formik.setFieldValue('term', value)}
                min={loanParameters.min_duration}
                max={loanParameters.max_duration}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} months`}
                sx={{ mb: 4 }}
              />
              
              <Typography gutterBottom>
                Interest Rate: {formik.values.interestRate}%
              </Typography>
              <Slider
                name="interestRate"
                value={formik.values.interestRate}
                onChange={(_, value) => formik.setFieldValue('interestRate', value)}
                min={loanParameters.min_interest_rate}
                max={loanParameters.max_interest_rate}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ mb: 4 }}
              />
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Summary
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Loan Amount
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    ${formik.values.amount.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    {formik.values.interestRate}%
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Loan Term
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    {formik.values.term} months
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Payment
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold" color="primary.main">
                    ${monthlyPayment.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Payment
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    ${totalPayment.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Interest
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold" color="warning.main">
                    ${(totalPayment - formik.values.amount).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

const Divider = ({ sx }) => (
  <Box 
    sx={{ 
      height: '1px', 
      bgcolor: 'rgba(0, 0, 0, 0.12)', 
      width: '100%', 
      ...sx 
    }} 
  />
);

export default ApplyLoanPage;