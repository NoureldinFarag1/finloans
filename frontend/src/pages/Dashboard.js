import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Card, CardContent, 
  Divider, LinearProgress, Avatar
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { loanService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await loanService.getLoans();
        setLoans(response.data);
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Failed to load loan data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Get role-specific data and stats
  const getDashboardData = () => {
    if (!currentUser || loading) {
      return {
        stats: [
          { title: 'Total Loans', value: '0', icon: <CreditCardIcon color="primary" /> },
          { title: 'Total Amount', value: '$0', icon: <AccountBalanceIcon color="success" /> },
          { title: 'Active Loans', value: '0', icon: <TrendingUpIcon color="warning" /> },
          { title: 'Next Payment', value: 'N/A', icon: <EventIcon color="info" /> }
        ]
      };
    }

    let stats = [];
    let filteredLoans = loans;
    
    // Role-specific logic
    switch (currentUser.role) {
      case 'LP': // Loan Provider
        filteredLoans = loans.filter(loan => loan.provider === currentUser.id);
        stats = [
          { 
            title: 'Total Loans', 
            value: filteredLoans.length.toString(), 
            icon: <CreditCardIcon color="primary" /> 
          },
          { 
            title: 'Total Amount', 
            value: `$${filteredLoans.reduce((sum, loan) => sum + parseFloat(loan.amount), 0).toFixed(2)}`, 
            icon: <AccountBalanceIcon color="success" /> 
          },
          { 
            title: 'Active Loans', 
            value: filteredLoans.filter(loan => loan.approved).length.toString(), 
            icon: <TrendingUpIcon color="warning" /> 
          },
          { 
            title: 'Approval Rate', 
            value: `${filteredLoans.length ? ((filteredLoans.filter(loan => loan.approved).length / filteredLoans.length) * 100).toFixed(0) : 0}%`, 
            icon: <EventIcon color="info" /> 
          }
        ];
        break;
      case 'LC': // Loan Customer
        filteredLoans = loans.filter(loan => loan.customer === currentUser.id);
        stats = [
          { 
            title: 'My Loans', 
            value: filteredLoans.length.toString(), 
            icon: <CreditCardIcon color="primary" /> 
          },
          { 
            title: 'Total Borrowed', 
            value: `$${filteredLoans.reduce((sum, loan) => sum + parseFloat(loan.amount), 0).toFixed(2)}`, 
            icon: <AccountBalanceIcon color="success" /> 
          },
          { 
            title: 'Active Loans', 
            value: filteredLoans.filter(loan => loan.approved).length.toString(), 
            icon: <TrendingUpIcon color="warning" /> 
          },
          { 
            title: 'Next Payment', 
            value: 'May 15, 2025', // This would be calculated from actual payment schedule
            icon: <EventIcon color="info" /> 
          }
        ];
        break;
      case 'BP': // Bank Personnel
        stats = [
          { 
            title: 'Total Loans', 
            value: loans.length.toString(), 
            icon: <CreditCardIcon color="primary" /> 
          },
          { 
            title: 'Total Value', 
            value: `$${loans.reduce((sum, loan) => sum + parseFloat(loan.amount), 0).toFixed(2)}`, 
            icon: <AccountBalanceIcon color="success" /> 
          },
          { 
            title: 'Approved Loans', 
            value: loans.filter(loan => loan.approved).length.toString(), 
            icon: <TrendingUpIcon color="warning" /> 
          },
          { 
            title: 'Approval Rate', 
            value: `${loans.length ? ((loans.filter(loan => loan.approved).length / loans.length) * 100).toFixed(0) : 0}%`, 
            icon: <EventIcon color="info" /> 
          }
        ];
        break;
      default:
        break;
    }
    
    return {
      stats,
      filteredLoans
    };
  };

  const { stats, filteredLoans } = getDashboardData();

  // Chart data for loan status distribution
  const doughnutData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          filteredLoans?.filter(loan => loan.approved).length || 0,
          filteredLoans?.filter(loan => !loan.approved).length || 0,
          0, // Assuming rejected status isn't implemented yet
        ],
        backgroundColor: [
          'rgba(58, 167, 109, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(229, 57, 53, 0.8)',
        ],
        borderColor: [
          'rgba(58, 167, 109, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(229, 57, 53, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for loan amount distribution over time
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Loan Amount ($)',
        data: [0, 5000, 8000, 12000, 15000, 20000], // Placeholder data
        borderColor: 'rgba(36, 81, 183, 1)',
        backgroundColor: 'rgba(36, 81, 183, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                height: '100%',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: 'background.paper',
                    width: 40,
                    height: 40,
                    mr: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Loan Amounts Over Time
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <Line 
                  data={lineData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Loan Status Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut 
                  data={doughnutData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;