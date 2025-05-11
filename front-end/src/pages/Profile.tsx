import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../api';

interface ProfileValues {
  bio: string;
  skills: string;      // comma-separated
  resume: string;      // URL
  experience: string;
}

const ProfileSchema = Yup.object().shape({
  bio:        Yup.string().required('Required'),
  skills:     Yup.string().required('Required'),
  resume:     Yup.string().url('Invalid URL').required('Required'),
  experience: Yup.string().required('Required')
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<ProfileValues>({
    bio: '',
    skills: '',
    resume: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    api.get('/profile/me')
      .then(res => {
        const { bio, skills, resume, experience, user } = res.data;
        setInitialValues({
          bio: bio || '',
          skills: (skills || []).join(', '),
          resume: resume || '',
          experience: experience || ''
        });
      })
      .catch(err => {
        if (err.response?.status === 404) {
          // no profile yet—keep defaults
        } else {
          setError('Failed to load profile');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (
    values: ProfileValues,
    { setSubmitting }: FormikHelpers<ProfileValues>
  ) => {
    setError(null);
    try {
      await api.put('/profile', {
        bio: values.bio,
        skills: values.skills,
        resume: values.resume,
        experience: values.experience
      });
      navigate('/jobs'); // or show a success message
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Update failed');
    } finally {
      setSubmitting(false);
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
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center">
          My Profile
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, values, handleChange }) => (
          <Form noValidate>
            <TextField
              name="bio"
              label="Bio"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={values.bio}
              onChange={handleChange}
              error={Boolean(errors.bio && touched.bio)}
              helperText={errors.bio && touched.bio && errors.bio}
            />

            <TextField
              name="skills"
              label="Skills (comma separated)"
              fullWidth
              margin="normal"
              value={values.skills}
              onChange={handleChange}
              error={Boolean(errors.skills && touched.skills)}
              helperText={errors.skills && touched.skills && errors.skills}
            />

            <TextField
              name="resume"
              label="Resume URL"
              fullWidth
              margin="normal"
              value={values.resume}
              onChange={handleChange}
              error={Boolean(errors.resume && touched.resume)}
              helperText={errors.resume && touched.resume && errors.resume}
            />

            <TextField
              name="experience"
              label="Experience"
              fullWidth
              margin="normal"
              value={values.experience}
              onChange={handleChange}
              error={Boolean(errors.experience && touched.experience)}
              helperText={errors.experience && touched.experience && errors.experience}
            />

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving…' : 'Save Profile'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
