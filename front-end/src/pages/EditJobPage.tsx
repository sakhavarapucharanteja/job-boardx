// src/pages/EditJobPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, MenuItem, CircularProgress
} from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../api';

interface JobForm {
  title:           string;
  company:         string;
  location:        string;
  employmentType:  'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  deadline:        string;    // in YYYY-MM-DD format
  experienceLevel: 'Junior' | 'Mid' | 'Senior';
  description:     string;
}

const JobSchema = Yup.object().shape({
  title:           Yup.string().required('Required'),
  company:         Yup.string().required('Required'),
  location:        Yup.string().required('Required'),
  employmentType:  Yup.mixed<JobForm['employmentType']>()
                     .oneOf(['Full-Time','Part-Time','Contract','Internship'])
                     .required('Required'),
  deadline:        Yup.string().required('Required'),
  experienceLevel: Yup.mixed<JobForm['experienceLevel']>()
                     .oneOf(['Junior','Mid','Senior'])
                     .required('Required'),
  description:     Yup.string().required('Required'),
});

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<JobForm | null>(null);

  useEffect(() => {
    api.get<JobForm & { deadline: string }>(`/jobs/${id}`)
      .then(res => {
        const job = res.data;
        setInitial({
          title:           job.title,
          company:         job.company,
          location:        job.location || '',
          employmentType:  job.employmentType || 'Full-Time',
          deadline:        job.deadline.split('T')[0],  // strip time
          experienceLevel: job.experienceLevel || 'Junior',
          description:     job.description || ''
        });
      })
      .catch(console.error);
  }, [id]);

  if (!initial) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = async (
    values: JobForm,
    { setSubmitting, setFieldError }: FormikHelpers<JobForm>
  ) => {
    try {
      await api.put(`/jobs/${id}`, values);
      navigate('/employer/jobs');
    } catch (err: any) {
      setFieldError('title', err.response?.data?.msg || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4">Edit Job</Typography>
      </Box>

      <Formik
        initialValues={initial}
        validationSchema={JobSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                {isSubmitting ? 'Updating…' : 'Update Job'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
