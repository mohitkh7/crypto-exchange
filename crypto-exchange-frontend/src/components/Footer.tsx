import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              CryptoExchange
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The most secure and advanced cryptocurrency trading platform
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/buy" color="inherit" underline="hover">
                Buy Crypto
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/sell" color="inherit" underline="hover">
                Sell Crypto
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="https://developers.bitgo.com/" color="inherit" underline="hover" target="_blank" rel="noopener">
                BitGo Developer Portal
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" href="https://facebook.com" target="_blank" rel="noopener">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com" target="_blank" rel="noopener">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" href="https://linkedin.com" target="_blank" rel="noopener">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} CryptoExchange. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 