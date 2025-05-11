// src/pages/MyApplicationsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import api from '../api';

interface MyApp {
  _id: string;
  job: {
    title: string;
    company: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<MyApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<MyApp[]>('/applications/me')
      .then(res => setApps(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        My Applications ({apps.length})
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Applied On</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apps.map(a => (
              <TableRow key={a._id}>
                <TableCell>{a.job.title}</TableCell>
                <TableCell>{a.job.company}</TableCell>
                <TableCell>{format(new Date(a.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Chip
                    label={a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    color={
                      a.status === 'accepted'
                        ? 'success'
                        : a.status === 'rejected'
                        ? 'error'
                        : 'default'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
            {apps.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  You have not applied to any jobs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
