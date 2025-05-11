// src/pages/ApplicantsPage.tsx
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
  CircularProgress,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api';

interface Applicant {
  _id: string;
  applicant: { name: string; email: string };
  coverLetter: string;
  resume: {
    originalName: string;
    path:         string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function ApplicantsPage() {
  const { id: jobId } = useParams<{id:string}>();
  const [apps, setApps]       = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = () => {
    setLoading(true);
    api.get<Applicant[]>(`/applications/job/${jobId}`)
      .then(res => setApps(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchApps, [jobId]);

  const handleChangeStatus = async (appId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

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
        Applicants ({apps.length})
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Applied On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apps.map(a => (
              <TableRow key={a._id}>
                <TableCell>{a.applicant.name}</TableCell>
                <TableCell>{a.applicant.email}</TableCell>
                <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    color={
                      a.status === 'accepted' ? 'success'
                      : a.status === 'rejected' ? 'error'
                      : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    component="a"
                    href={`http://localhost:5001/${a.resume.path}`}
                    download={a.resume.originalName}
                    target="_blank"
                  >
                    {a.resume.originalName}
                  </Button>
                </TableCell>
                <TableCell>
                  {a.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        onClick={() => handleChangeStatus(a._id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleChangeStatus(a._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
