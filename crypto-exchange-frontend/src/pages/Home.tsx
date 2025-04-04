import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  CurrencyBitcoin,
  Security,
  Speed,
  Support,
  ArrowForward,
  Facebook,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <CurrencyBitcoin sx={{ fontSize: 40 }} />,
      title: 'Multiple Cryptocurrencies',
      description: 'Trade Bitcoin, Ethereum, and many other cryptocurrencies',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Trading',
      description: 'Advanced security measures to protect your assets',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Fast Transactions',
      description: 'Execute trades quickly with our advanced platform',
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your needs',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              CryptoExchange
            </Typography>
            <Box>
              <Button color="inherit" sx={{ mr: 2 }}>
                Login
              </Button>
              <Button variant="contained" color="secondary">
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom>
                Trade Crypto with Confidence
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                Join the future of digital currency trading
              </Typography>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Typography variant="h4" color="secondary.main" gutterBottom>
                  Get $100 Free Bonus!
                </Typography>
                <Typography variant="body1">
                  Sign up now and receive $100 in trading credits
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
              >
                Start Trading Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/crypto-illustration.svg"
                alt="Crypto Trading"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Experience the best in cryptocurrency trading
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'secondary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
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
                About Us
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Terms of Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Privacy Policy
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
            © 2024 CryptoExchange. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 