// src/pages/JobDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import api from '../api';

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  postedAt: string;
  deadline?: string;
  experienceLevel?: string;
  salaryRange?: string;
  skills?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  description?: string;
}

interface Application {
  _id: string;
  job: { _id: string };
}

export default function JobDetailPage() {
  const { id } = useParams<{id:string}>();
  const [job, setJob]           = useState<Job | null>(null);
  const [loading, setLoading]   = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch job details
  useEffect(() => {
    api.get<Job>(`/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Check if user already applied
  useEffect(() => {
    if (!job) return;
    api.get<Application[]>('/applications/me')
      .then(res => {
        const applied = res.data.some(a => a.job._id === job._id);
        setHasApplied(applied);
      })
      .catch(console.error);
  }, [job]);

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress/></Box>;
  if (!job)   return <Typography mt={4} align="center">Job not found.</Typography>;

  return (
    <Box p={2} maxWidth="800px" margin="0 auto">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1">{job.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {job.company} • {job.location || 'Remote'}
        </Typography>
        <Box mt={1}>
          <Chip label={job.employmentType || 'N/A'} size="small" sx={{ mr: 1 }}/>
          <Chip label={job.experienceLevel || 'All Levels'} size="small" sx={{ mr: 1 }}/>
          {job.salaryRange && <Chip label={job.salaryRange} size="small"/>}
        </Box>
        <Typography variant="caption" color="textSecondary" display="block" mt={1}>
          Posted: {format(new Date(job.postedAt), 'MMM d, yyyy')}
          {job.deadline && ` • Apply by ${format(new Date(job.deadline), 'MMM d, yyyy')}`}
        </Typography>
      </Box>

      <Divider/>

      {/* Details */}
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={8}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography component="div" whiteSpace="pre-line">
              {job.description}
            </Typography>
          </Box>

          {job.responsibilities?.length && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Responsibilities</Typography>
              <ul>
                {job.responsibilities.map((r,i) => <li key={i}><Typography>{r}</Typography></li>)}
              </ul>
            </Box>
          )}
          {job.qualifications?.length && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Qualifications</Typography>
              <ul>
                {job.qualifications.map((q,i) => <li key={i}><Typography>{q}</Typography></li>)}
              </ul>
            </Box>
          )}
          {job.benefits?.length && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Benefits</Typography>
              <ul>
                {job.benefits.map((b,i) => <li key={i}><Typography>{b}</Typography></li>)}
              </ul>
            </Box>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {job.skills?.length && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>Skills</Typography>
              <Box>
                {job.skills.map((s,i) => <Chip key={i} label={s} size="small" sx={{ mr:0.5, mb:0.5 }}/>)}
              </Box>
            </Box>
          )}

          {hasApplied ? (
            <Button variant="outlined" fullWidth disabled>
              Already Applied
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              component={RouterLink}
              to={`/apply/${job._id}`}
            >
              Apply Now
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
