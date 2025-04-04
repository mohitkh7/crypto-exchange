import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade';
  asset: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const Wallet: React.FC = () => {
  // Mock data for assets
  const assets: Asset[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.5,
      value: 22500,
      change24h: 2.5,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 2.0,
      value: 6000,
      change24h: -1.2,
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      balance: 1000,
      value: 1200,
      change24h: 5.8,
    },
  ];

  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      asset: 'BTC',
      amount: 0.1,
      date: '2024-04-04 14:30:00',
      status: 'completed',
    },
    {
      id: '2',
      type: 'trade',
      asset: 'ETH',
      amount: -0.5,
      date: '2024-04-04 13:15:00',
      status: 'completed',
    },
    {
      id: '3',
      type: 'withdrawal',
      asset: 'ADA',
      amount: -100,
      date: '2024-04-04 12:00:00',
      status: 'pending',
    },
  ];

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <AddIcon sx={{ color: 'success.main' }} />;
      case 'withdrawal':
        return <RemoveIcon sx={{ color: 'error.main' }} />;
      case 'trade':
        return <AccountBalanceIcon sx={{ color: 'info.main' }} />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Wallet
      </Typography>

      {/* Assets Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {assets.map((asset) => (
          <Grid item xs={12} sm={6} md={4} key={asset.symbol}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{asset.name}</Typography>
                <Chip
                  label={`${asset.change24h > 0 ? '+' : ''}${asset.change24h}%`}
                  color={asset.change24h >= 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <Typography variant="h4" gutterBottom>
                ${asset.value.toLocaleString()}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Balance: {asset.balance} {asset.symbol}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  startIcon={<AddIcon />}
                >
                  Deposit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RemoveIcon />}
                >
                  Withdraw
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Transaction History */}
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getTransactionIcon(transaction.type)}
                    <Typography sx={{ ml: 1 }}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{transaction.asset}</TableCell>
                <TableCell>
                  <Typography
                    color={transaction.amount >= 0 ? 'success.main' : 'error.main'}
                  >
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </Typography>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={getStatusColor(transaction.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Wallet; 