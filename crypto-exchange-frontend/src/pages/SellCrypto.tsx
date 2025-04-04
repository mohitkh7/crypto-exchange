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

const SellCrypto: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCoin, setSelectedCoin] = useState<string>('eth');
  const [price, setPrice] = useState<number | null>(null);
  const [amountCoin, setAmountCoin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [equivalentUSD, setEquivalentUSD] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
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
      setEquivalentUSD(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the price');
    } finally {
      setLoading(false);
    }
  };

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCoin(event.target.value);
    setPrice(null);
    setEquivalentUSD(null);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmountCoin(value);
    if (price) {
      const amountInCoin = parseFloat(value);
      if (!isNaN(amountInCoin) && amountInCoin > 0) {
        setEquivalentUSD(amountInCoin * price);
      } else {
        setEquivalentUSD(null);
      }
    }
  };

  const handleSell = async () => {
    if (!token || !price || !amountCoin || isNaN(Number(amountCoin)) || Number(amountCoin) <= 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URLS.account.actions('sell'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cryptoType: selectedCoin,
          amount: Number(amountCoin),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete sale');
      }

      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sale');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Sell Cryptocurrency
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
                    label={`Amount in ${selectedCoin}`}
                    type="number"
                    value={amountCoin}
                    onChange={handleAmountChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {equivalentUSD !== null && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent USD: ${equivalentUSD.toFixed(2)}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSell}
                    disabled={loading || !amountCoin || isNaN(Number(amountCoin)) || Number(amountCoin) <= 0}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sell Now'}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>

          <Button variant="outlined" onClick={() => navigate('/account')} sx={{ mt: 2 }}>
            Back to Account
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default SellCrypto;
