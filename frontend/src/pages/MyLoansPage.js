import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Container, 
  Alert, CircularProgress, TextField, InputAdornment,
  MenuItem, Select, FormControl, InputLabel, Tabs, Tab 
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { loanService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoanCard from '../components/LoanCard';

const MyLoansPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Fetch loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await loanService.getLoans();
        
        // Filter loans based on user role
        let userLoans = response.data;
        if (currentUser.role === 'LC') {
          // For loan customers, only show their loans
          userLoans = response.data.filter(loan => loan.customer.user.id === currentUser.id);
        } else if (currentUser.role === 'LP') {
          // For loan providers, only show their loans
          userLoans = response.data.filter(loan => loan.provider.user.id === currentUser.id);
        }
        
        setLoans(userLoans);
        setFilteredLoans(userLoans);
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Failed to load loans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [currentUser]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    if (newValue === 0) { // All loans
      filterLoans(searchTerm, 'all');
    } else if (newValue === 1) { // Approved loans
      filterLoans(searchTerm, 'approved');
    } else if (newValue === 2) { // Pending loans
      filterLoans(searchTerm, 'pending');
    }
  };

  // Handle search and filter
  const filterLoans = (search, status) => {
    let filtered = loans;
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(loan => 
        loan.id.toString().includes(search) || 
        parseFloat(loan.amount).toFixed(2).includes(search)
      );
    }
    
    // Apply status filter
    if (status === 'approved') {
      filtered = filtered.filter(loan => loan.approved);
    } else if (status === 'pending') {
      filtered = filtered.filter(loan => !loan.approved);
    }
    
    setFilteredLoans(filtered);
    setSearchTerm(search);
    setStatusFilter(status);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    filterLoans(event.target.value, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    filterLoans(searchTerm, event.target.value);
  };

  // Navigate to loan details page
  const handleViewDetails = (loanId) => {
    navigate(`/loans/${loanId}`);
  };

  // Navigate to make payment page
  const handleMakePayment = (loanId) => {
    navigate(`/make-payment/${loanId}`);
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

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Loans
      </Typography>
      
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          bgcolor: 'background.default'
        }}
      >
        <TextField
          placeholder="Search loans..."
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Loans" />
          <Tab label="Approved" />
          <Tab label="Pending" />
        </Tabs>
      </Box>
      
      {filteredLoans.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No loans found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? "Try a different search term or filter" 
              : "Apply for a loan to get started"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredLoans.map((loan) => (
            <Grid item xs={12} sm={6} md={4} key={loan.id}>
              <LoanCard 
                loan={loan} 
                onViewDetails={handleViewDetails}
                onMakePayment={handleMakePayment}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyLoansPage;