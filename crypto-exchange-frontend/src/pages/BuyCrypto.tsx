import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Alert,
  MenuItem,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

const BuyCrypto: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCoin, setSelectedCoin] = useState<string>('eth');
  const [price, setPrice] = useState<number | null>(null);
  const [amountUSD, setAmountUSD] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [equivalentAmount, setEquivalentAmount] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
      return;
    }
    setToken(storedToken);
  }, [navigate]);

  useEffect(() => {
    if (selectedCoin && token) {
      fetchPrice();
    }
  }, [selectedCoin, token]);

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCoin(event.target.value);
    setPrice(null); // Reset price when coin changes
    setEquivalentAmount(null); // Reset equivalent amount
  };

  const fetchPrice = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URLS.crypto.price}/${selectedCoin}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch price');
      }

      setPrice(data.data.price);
      setEquivalentAmount(null); // Reset equivalent amount when fetching new price
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the price');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmountUSD(value);
    if (price) {
      const amountInUSD = parseFloat(value);
      if (!isNaN(amountInUSD) && amountInUSD > 0) {
        setEquivalentAmount(amountInUSD / price);
      } else {
        setEquivalentAmount(null);
      }
    }
  };

  const handleBuy = async () => {
    if (!token || !price || !amountUSD || isNaN(Number(amountUSD)) || Number(amountUSD) <= 0) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URLS.account.actions('buy'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cryptoType: selectedCoin,
          amount: Number(amountUSD) / price, // Convert USD amount to crypto amount
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete purchase');
      }

      // Navigate back to account page on success
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during purchase');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Buy Cryptocurrency
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Cryptocurrency"
                value={selectedCoin}
                onChange={handleCoinChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="eth">Ethereum (ETH)</MenuItem>
                <MenuItem value="btc">Bitcoin (BTC)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={fetchPrice} 
                sx={{ mb: 2 }}
                disabled={loading}
              >
                Get Current Price
              </Button>
            </Grid>

            {loading && (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Grid>
            )}

            {price && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Current Price: ${price.toFixed(2)} USD
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Amount in USD"
                    type="number"
                    value={amountUSD}
                    onChange={handleAmountChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Grid>

                {equivalentAmount !== null && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent Amount: {equivalentAmount.toFixed(6)} {selectedCoin.toUpperCase()}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBuy}
                    disabled={loading || !amountUSD || isNaN(Number(amountUSD)) || Number(amountUSD) <= 0}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Buy Now'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/account')}
                    sx={{ mt: 2 }}
                  >
                    Back to Account
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default BuyCrypto; 