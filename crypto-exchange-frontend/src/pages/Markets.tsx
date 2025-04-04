import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  TableSortLabel,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface CryptoData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

const Markets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<keyof CryptoData>('marketCap');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data - in a real app, this would come from an API
  const cryptoData: CryptoData[] = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 45000,
      change24h: 2.5,
      volume24h: 28000000000,
      marketCap: 850000000000,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3000,
      change24h: -1.2,
      volume24h: 15000000000,
      marketCap: 350000000000,
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      price: 1.2,
      change24h: 5.8,
      volume24h: 5000000000,
      marketCap: 40000000000,
    },
  ];

  const handleSort = (property: keyof CryptoData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const filteredData = cryptoData.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Markets
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'change24h'}
                  direction={orderBy === 'change24h' ? order : 'asc'}
                  onClick={() => handleSort('change24h')}
                >
                  24h Change
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'volume24h'}
                  direction={orderBy === 'volume24h' ? order : 'asc'}
                  onClick={() => handleSort('volume24h')}
                >
                  24h Volume
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'marketCap'}
                  direction={orderBy === 'marketCap' ? order : 'asc'}
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((crypto) => (
              <TableRow key={crypto.symbol} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      {crypto.name}
                    </Typography>
                    <Chip
                      label={crypto.symbol}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{formatNumber(crypto.price)}</TableCell>
                <TableCell>
                  <Chip
                    label={`${crypto.change24h > 0 ? '+' : ''}${crypto.change24h}%`}
                    size="small"
                    color={crypto.change24h >= 0 ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>{formatNumber(crypto.volume24h)}</TableCell>
                <TableCell>{formatNumber(crypto.marketCap)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Markets; 