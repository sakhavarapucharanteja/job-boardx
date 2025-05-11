// src/pages/CreateJobPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, MenuItem
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../api';

interface JobForm {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  deadline: string;
  experienceLevel: string;
  description: string;
}

const JobSchema = Yup.object().shape({
  title:           Yup.string().required('Required'),
  company:         Yup.string().required('Required'),
  location:        Yup.string().required('Required'),
  employmentType:  Yup.string().oneOf(['Full-Time','Part-Time','Contract','Internship']).required('Required'),
  deadline:        Yup.date().required('Required'),
  experienceLevel: Yup.string().oneOf(['Junior','Mid','Senior']).required('Required'),
  description:     Yup.string().required('Required'),
});

export default function CreateJobPage() {
  const navigate = useNavigate();

  const initial: JobForm = {
    title: '',
    company: '',
    location: '',
    employmentType: 'Full-Time',
    deadline: '',
    experienceLevel: 'Junior',
    description: '',
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4">Post New Job</Typography>
      </Box>
      <Formik
        initialValues={initial}
        validationSchema={JobSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await api.post('/jobs', values);
            navigate('/employer/jobs');
          } catch (err: any) {
            setFieldError('title', err.response?.data?.msg || 'Failed to post job');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form>
            <TextField
              name="title"
              label="Job Title"
              fullWidth margin="normal"
              value={values.title}
              onChange={handleChange}
              error={Boolean(errors.title && touched.title)}
              helperText={errors.title && touched.title && errors.title}
            />

            <TextField
              name="company"
              label="Company"
              fullWidth margin="normal"
              value={values.company}
              onChange={handleChange}
              error={Boolean(errors.company && touched.company)}
              helperText={errors.company && touched.company && errors.company}
            />

            <TextField
              name="location"
              label="Location"
              fullWidth margin="normal"
              value={values.location}
              onChange={handleChange}
              error={Boolean(errors.location && touched.location)}
              helperText={errors.location && touched.location && errors.location}
            />

            <TextField
              select
              name="employmentType"
              label="Employment Type"
              fullWidth margin="normal"
              value={values.employmentType}
              onChange={handleChange}
            >
              {['Full-Time','Part-Time','Contract','Internship'].map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>

            <TextField
              name="deadline"
              label="Application Deadline"
              type="date"
              fullWidth margin="normal"
              InputLabelProps={{ shrink: true }}
              value={values.deadline}
              onChange={handleChange}
              error={Boolean(errors.deadline && touched.deadline)}
              helperText={errors.deadline && touched.deadline && errors.deadline}
            />

            <TextField
              select
              name="experienceLevel"
              label="Experience Level"
              fullWidth margin="normal"
              value={values.experienceLevel}
              onChange={handleChange}
            >
              {['Junior','Mid','Senior'].map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>

            <TextField
              name="description"
              label="Job Description"
              multiline rows={4}
              fullWidth margin="normal"
              value={values.description}
              onChange={handleChange}
              error={Boolean(errors.description && touched.description)}
              helperText={errors.description && touched.description && errors.description}
            />

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting…' : 'Post Job'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
