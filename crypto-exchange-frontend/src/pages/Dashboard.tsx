import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const marketData = [
    { name: 'Bitcoin', symbol: 'BTC', price: 45000, change: 2.5 },
    { name: 'Ethereum', symbol: 'ETH', price: 3000, change: -1.2 },
    { name: 'Cardano', symbol: 'ADA', price: 1.2, change: 5.8 },
  ];

  const stats = [
    { title: '24h Volume', value: '$2.5B', icon: <ShowChart /> },
    { title: 'Active Users', value: '125K', icon: <AccountBalance /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {stat.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Market Overview */}
      <Typography variant="h5" gutterBottom>
        Market Overview
      </Typography>
      <Grid container spacing={3}>
        {marketData.map((coin) => (
          <Grid item xs={12} sm={6} md={4} key={coin.symbol}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{coin.name}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {coin.symbol}
                  </Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                  ${coin.price.toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center">
                  {coin.change >= 0 ? (
                    <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                  )}
                  <Typography
                    variant="body1"
                    color={coin.change >= 0 ? 'success.main' : 'error.main'}
                  >
                    {coin.change > 0 ? '+' : ''}{coin.change}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.abs(coin.change) * 10}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: coin.change >= 0 ? 'success.main' : 'error.main',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 