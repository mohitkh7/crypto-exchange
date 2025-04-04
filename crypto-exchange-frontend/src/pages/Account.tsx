import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as BuyIcon,
  Sell as SellIcon,
  Add as DepositIcon,
  Remove as WithdrawIcon,
} from '@mui/icons-material';
import { API_URLS } from '../config';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AccountData {
  balance: number;
}

const Account: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'sell' | 'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchAccountData(token);
  }, [navigate]);

  const fetchAccountData = async (token: string) => {
    try {
      const response = await fetch(API_URLS.account.balance, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }

      const data = await response.json();
      setAccountData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleActionClick = (type: 'buy' | 'sell' | 'deposit' | 'withdraw') => {
    if (type === 'buy') {
      navigate('/buy');
      return;
    }
    if (type === 'sell') {
      navigate('/sell');
      return;
    }
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType(null);
    setAmount('');
  };

  const handleSubmitAction = async () => {
    if (!dialogType || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('token');

    try {
      const endpoint = API_URLS.account.actions(dialogType);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${dialogType}`);
      }

      // Refresh account data
      await fetchAccountData(token || '');
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : `An error occurred during ${dialogType}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              My Account
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalanceIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Account Balance</Typography>
                <Typography variant="h3">
                  ${accountData?.balance.toFixed(2) || '0.00'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<BuyIcon />}
                onClick={() => handleActionClick('buy')}
                sx={{ py: 2 }}
              >
                Buy Crypto
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SellIcon />}
                onClick={() => handleActionClick('sell')}
                sx={{ py: 2 }}
              >
                Sell Crypto
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DepositIcon />}
                onClick={() => handleActionClick('deposit')}
                sx={{ py: 2 }}
              >
                Deposit
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<WithdrawIcon />}
                onClick={() => handleActionClick('withdraw')}
                sx={{ py: 2 }}
              >
                Withdraw
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Action Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'sell' && 'Sell Cryptocurrency'}
          {dialogType === 'deposit' && 'Deposit Funds'}
          {dialogType === 'withdraw' && 'Withdraw Funds'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount ($)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitAction} 
            variant="contained" 
            disabled={processing || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
          >
            {processing ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Account; 