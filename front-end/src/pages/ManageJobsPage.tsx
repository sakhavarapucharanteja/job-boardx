// src/pages/ManageJobsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  postedAt: string;
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch the employer's jobs
  useEffect(() => {
    api.get<Job[]>('/jobs/my')
      .then(res => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Confirm and perform deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/jobs/${deleteId}`);
      setJobs(j => j.filter(job => job._id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">My Job Postings</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/employer/jobs/create')}
        >
          Post New Job
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Posted</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map(job => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location || '—'}</TableCell>
                <TableCell>{job.employmentType || '—'}</TableCell>
                <TableCell>{new Date(job.postedAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => navigate(`/employer/jobs/edit/${job._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                  >
                    Applicants
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteId(job._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  You haven't posted any jobs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job posting? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
