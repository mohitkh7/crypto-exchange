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
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as BuyIcon,
  Sell as SellIcon,
  Add as DepositIcon,
  Remove as WithdrawIcon,
  CurrencyBitcoin as BitcoinIcon,
  CurrencyExchange as EthereumIcon,
  AttachMoney as UsdIcon,
  ArrowUpward as BuyTransactionIcon,
  ArrowDownward as SellTransactionIcon,
  AddCircle as DepositTransactionIcon,
  RemoveCircle as WithdrawTransactionIcon,
} from '@mui/icons-material';
import { API_URLS } from '../config';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Asset {
  asset: string;
  amount: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  asset: string;
  amount: number;
  price?: number;
  status: string;
  createdAt: string;
}

const Account: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    fetchTransactions(token);
  }, [navigate]);

  const fetchAccountData = async (token: string) => {
    try {
      const response = await fetch(API_URLS.crypto.balance, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }

      const data = await response.json();
      setAssets(data.data.assets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (token: string) => {
    try {
      const response = await fetch(API_URLS.crypto.transactions, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
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
    if (type === 'deposit') {
      navigate('/deposit');
      return;
    }
    if (type === 'withdraw') {
      navigate('/withdraw');
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

  const getAssetIcon = (asset: string) => {
    switch (asset.toLowerCase()) {
      case 'btc':
            return <BitcoinIcon />;
      case 'eth':
            return <EthereumIcon />;
      case 'usd':
            return <UsdIcon />;
      default:
            return <AccountBalanceIcon />;
    }
  };

  const formatAssetAmount = (asset: string, amount: number) => {
    if (asset.toLowerCase() === 'usd') {
      return `$${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(8)} ${asset.toUpperCase()}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <BuyTransactionIcon sx={{ color: theme.palette.success.main }} />;
      case 'sell':
        return <SellTransactionIcon sx={{ color: theme.palette.error.main }} />;
      case 'deposit':
        return <DepositTransactionIcon sx={{ color: theme.palette.info.main }} />;
      case 'withdraw':
        return <WithdrawTransactionIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return <AccountBalanceIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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

          <Typography variant="h5" gutterBottom>
            Asset Balances
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {assets.map((asset) => (
              <Grid item xs={12} sm={6} md={4} key={asset.asset}>
                <Card 
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                    color: 'white',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getAssetIcon(asset.asset)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {asset.asset.toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {formatAssetAmount(asset.asset, asset.amount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
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

          <Typography variant="h5" gutterBottom>
            Recent Transactions
          </Typography>

          {transactions.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No transactions available
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTransactionIcon(transaction.type)}
                          <Typography sx={{ textTransform: 'capitalize' }}>
                            {transaction.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.asset.toUpperCase()}</TableCell>
                      <TableCell>{formatAssetAmount(transaction.asset, transaction.amount)}</TableCell>
                      <TableCell>
                        {transaction.price ? `$${transaction.price.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={
                            transaction.status === 'completed' ? 'success' :
                            transaction.status === 'pending' ? 'warning' :
                            'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

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