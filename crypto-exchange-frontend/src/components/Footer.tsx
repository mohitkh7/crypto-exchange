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
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/login" color="inherit" underline="hover">
                Login
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/signup" color="inherit" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
              <IconButton color="inherit">
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