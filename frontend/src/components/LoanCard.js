import React from 'react';
import {
  Card, CardContent, Typography, Chip, Box,
  Grid, Button, LinearProgress, Avatar
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as PendingIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const LoanCard = ({ loan, onMakePayment, onViewDetails }) => {
  // Calculate progress
  const startDate = new Date(loan.start_date);
  const endDate = new Date(loan.end_date);
  const today = new Date();
  
  // Calculate progress percentage
  const totalDuration = endDate - startDate;
  const elapsed = today - startDate;
  const progress = Math.min(Math.max(Math.floor((elapsed / totalDuration) * 100), 0), 100);
  
  // Format start and end dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        height: '100%',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Loan #{loan.id}
          </Typography>
          <Chip
            icon={loan.approved ? <ApprovedIcon /> : <PendingIcon />}
            label={loan.approved ? 'Approved' : 'Pending'}
            color={loan.approved ? 'success' : 'warning'}
            size="small"
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            ${parseFloat(loan.amount).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            at {loan.interest_rate}% interest
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body1">
              {formatDate(loan.start_date)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="body1">
              {formatDate(loan.end_date)}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onViewDetails(loan.id)}
            sx={{ flexGrow: 1 }}
          >
            View Details
          </Button>
          {loan.approved && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onMakePayment(loan.id)}
              sx={{ flexGrow: 1 }}
            >
              Make Payment
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoanCard;