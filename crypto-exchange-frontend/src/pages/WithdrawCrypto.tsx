import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface WithdrawResponse {
  success: boolean;
  message: string;
}

const WithdrawCrypto: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [supportedAssets, setSupportedAssets] = useState<string[]>(['tbtc4', 'hteth']);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch supported assets
    const fetchSupportedAssets = async () => {
      try {
        const response = await fetch(`${API_URLS.crypto.price}/supported`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch supported assets');
        }

        const data = await response.json();
        if (data.success && data.data.supportedCoins) {
          setSupportedAssets(data.data.supportedCoins);
        }
      } catch (err) {
        console.error('Error fetching supported assets:', err);
        // Continue with default assets
      }
    };

    // fetchSupportedAssets();
  }, [navigate]);

  const handleAssetChange = (event: SelectChangeEvent<string>) => {
    setSelectedAsset(event.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAddress(event.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleWithdraw = async () => {
    if (!selectedAsset || !withdrawAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(API_URLS.crypto.withdraw, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cryptoType: selectedAsset,
          amount: amountNum,
          address: withdrawAddress,
        }),
      });

      const data: WithdrawResponse = await response.json();
      
      if (data.success) {
        setSuccess('Withdrawal request submitted successfully');
        setAmount('');
        setWithdrawAddress('');
      } else {
        throw new Error(data.message || 'Failed to process withdrawal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAccount = () => {
    navigate('/account');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Withdraw Cryptocurrency
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="asset-select-label">Select Cryptocurrency</InputLabel>
            <Select
              labelId="asset-select-label"
              value={selectedAsset}
              label="Select Cryptocurrency"
              onChange={handleAssetChange}
            >
              {supportedAssets.map((asset) => (
                <MenuItem key={asset} value={asset}>
                  {asset.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Withdrawal Address"
            value={withdrawAddress}
            onChange={handleAddressChange}
            sx={{ mb: 3 }}
            placeholder={`Enter ${selectedAsset ? selectedAsset.toUpperCase() : 'cryptocurrency'} address`}
          />

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            sx={{ mb: 3 }}
            placeholder={`Enter amount in ${selectedAsset ? selectedAsset.toUpperCase() : 'cryptocurrency'}`}
            InputProps={{
              inputProps: { min: 0, step: "any" }
            }}
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleWithdraw}
            disabled={!selectedAsset || !withdrawAddress || !amount || loading}
            fullWidth
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Withdraw'}
          </Button>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleBackToAccount}
            >
              Back to Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default WithdrawCrypto; 