import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trading: React.FC = () => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  // Mock data for the price chart
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Price',
        data: [45000, 46000, 45500, 47000, 46500, 48000, 47500],
        borderColor: '#00b0ff',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  // Mock data for order book
  const orderBook = {
    bids: [
      { price: 47400, amount: 0.5, total: 23700 },
      { price: 47300, amount: 1.2, total: 56760 },
      { price: 47200, amount: 0.8, total: 37760 },
    ],
    asks: [
      { price: 47600, amount: 0.3, total: 14280 },
      { price: 47700, amount: 0.7, total: 33390 },
      { price: 47800, amount: 1.0, total: 47800 },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    console.log('Order submitted:', { orderType, amount, price, selectedCrypto });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trading
      </Typography>

      <Grid container spacing={3}>
        {/* Price Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Line data={chartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Trading Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Place Order
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Cryptocurrency</InputLabel>
                <Select
                  value={selectedCrypto}
                  label="Cryptocurrency"
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                >
                  <MenuItem value="BTC">Bitcoin (BTC)</MenuItem>
                  <MenuItem value="ETH">Ethereum (ETH)</MenuItem>
                  <MenuItem value="ADA">Cardano (ADA)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <Tabs
                  value={orderType}
                  onChange={(_, newValue) => setOrderType(newValue)}
                  sx={{ mb: 2 }}
                >
                  <Tab
                    value="buy"
                    label="Buy"
                    sx={{
                      color: 'success.main',
                      '&.Mui-selected': {
                        color: 'success.main',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                  <Tab
                    value="sell"
                    label="Sell"
                    sx={{
                      color: 'error.main',
                      '&.Mui-selected': {
                        color: 'error.main',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </Tabs>
              </Box>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                color={orderType === 'buy' ? 'success' : 'error'}
                type="submit"
              >
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Order Book */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Book
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBook.asks.map((ask, index) => (
                    <TableRow key={`ask-${index}`}>
                      <TableCell sx={{ color: 'error.main' }}>
                        ${ask.price.toLocaleString()}
                      </TableCell>
                      <TableCell>{ask.amount}</TableCell>
                      <TableCell>${ask.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {orderBook.bids.map((bid, index) => (
                    <TableRow key={`bid-${index}`}>
                      <TableCell sx={{ color: 'success.main' }}>
                        ${bid.price.toLocaleString()}
                      </TableCell>
                      <TableCell>{bid.amount}</TableCell>
                      <TableCell>${bid.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Trading; 