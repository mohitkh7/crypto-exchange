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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface DepositAddressResponse {
  success: boolean;
  data: {
    depositAddress: string;
  };
}

const DepositCrypto: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedAssets, setSupportedAssets] = useState<string[]>(['btc', 'eth']);

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

    fetchSupportedAssets();
  }, [navigate]);

  const handleAssetChange = (event: SelectChangeEvent<string>) => {
    setSelectedAsset(event.target.value);
    setDepositAddress('');
    setError(null);
  };

  const fetchDepositAddress = async () => {
    if (!selectedAsset) {
      setError('Please select a cryptocurrency');
      return;
    }

    setLoading(true);
    setError(null);
    setDepositAddress('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(API_URLS.crypto.depositAddress(selectedAsset), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch deposit address');
      }

      const data: DepositAddressResponse = await response.json();
      
      if (data.success && data.data.depositAddress) {
        setDepositAddress(data.data.depositAddress);
      } else {
        throw new Error('Invalid response format');
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
            Deposit Cryptocurrency
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
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
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchDepositAddress}
            disabled={!selectedAsset || loading}
            fullWidth
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Deposit Address'}
          </Button>
          
          {depositAddress && (
            <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Deposit {selectedAsset.toUpperCase()} to this address:
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-all', 
                  p: 2, 
                  bgcolor: 'grey.100', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}
              >
                {depositAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Make sure to send only {selectedAsset.toUpperCase()} to this address. Sending any other cryptocurrency may result in permanent loss.
              </Typography>
            </Box>
          )}
          
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

export default DepositCrypto; 