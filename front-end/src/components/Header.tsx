// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user,setUser } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);      
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          JobBoardX
        </Typography>

        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}

        {user?.role === 'job_seeker' && (
          <>
            <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
            <Button color="inherit" component={Link} to="/applications">My Applications</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}

        {user?.role === 'employer' && (
          <>
            <Button color="inherit" component={Link} to="/employer/jobs">Manage Jobs</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
