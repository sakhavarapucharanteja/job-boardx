// src/pages/HomePage.tsx
import React from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box py={8} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to JobBoardX
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Connecting great talent with amazing companies
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={4}>
        {/* Job Seeker Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Looking for a Job?
              </Typography>
              <Typography color="textSecondary">
                Browse thousands of openings and apply in just a few clicks.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  navigate('/login', { state: { redirect: '/jobs' } })
                }
              >
                Find Jobs
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Employer Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Hiring Now?
              </Typography>
              <Typography color="textSecondary">
                Post your openings and find the perfect candidates fast.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  navigate('/register', { state: { role: 'employer' } })
                }
              >
                Post a Job
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
