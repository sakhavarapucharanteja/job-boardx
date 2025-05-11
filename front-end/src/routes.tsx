import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import JobsTable from './pages/JobsList';
import ApplyPage from './pages/ApplyPage';
import PrivateRoute from './components/PrivateRoute';
import JobDetailPage from './pages/JobDetailPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/jobs" element={<PrivateRoute><JobsTable/></PrivateRoute>} />
    <Route path="/jobs/:id" element={<PrivateRoute><JobDetailPage/></PrivateRoute>} />
    <Route path="/apply/:id" element={<PrivateRoute><ApplyPage/></PrivateRoute>} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default AppRoutes;