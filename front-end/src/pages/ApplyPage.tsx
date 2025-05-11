// src/pages/ApplyPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, TextField
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../api';


interface ApplyValues {
  fullName:   string;
  email:      string;
  phone:      string;
  coverLetter:string;
  resume:     File | null;
}

const ApplySchema = Yup.object().shape({
  fullName:    Yup.string().required('Required'),
  email:       Yup.string().email('Invalid email').required('Required'),
  phone:       Yup.string(),
  coverLetter: Yup.string().required('Required'),
  resume:      Yup.mixed().required('Required')
});

export default function ApplyPage() {
  const { id }    = useParams<{id:string}>();
  const navigate  = useNavigate();

  const initial: ApplyValues = {
    fullName: '', email: '', phone: '', coverLetter: '', resume: null
  };

  const handleSubmit = async (
    values: ApplyValues,
    { setSubmitting, setFieldError }: FormikHelpers<ApplyValues>
  ) => {
    if (!values.resume) return;
    const formData = new FormData();
    formData.append('job', id!);
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('coverLetter', values.coverLetter);
    formData.append('resume', values.resume);

    try {
      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/jobs');
    } catch (err: any) {
      setFieldError('resume', err.response?.data?.msg || 'Apply failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Apply for Job
        </Typography>

        <Formik
          initialValues={initial}
          validationSchema={ApplySchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, isSubmitting }) => (
            <Form encType="multipart/form-data">
              <Field
                as={TextField}
                name="fullName"
                label="Full Name"
                fullWidth margin="normal"
                error={Boolean(errors.fullName && touched.fullName)}
                helperText={errors.fullName && touched.fullName && errors.fullName}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth margin="normal"
                error={Boolean(errors.email && touched.email)}
                helperText={errors.email && touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="phone"
                label="Phone"
                fullWidth margin="normal"
                error={Boolean(errors.phone && touched.phone)}
                helperText={errors.phone && touched.phone && errors.phone}
              />
              <Field
                as={TextField}
                name="coverLetter"
                label="Cover Letter"
                fullWidth
                multiline rows={4}
                margin="normal"
                error={Boolean(errors.coverLetter && touched.coverLetter)}
                helperText={errors.coverLetter && touched.coverLetter && errors.coverLetter}
              />

              <Box mt={2}>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={e => {
                    if (e.currentTarget.files) {
                      setFieldValue('resume', e.currentTarget.files[0]);
                    }
                  }}
                />
                {errors.resume && touched.resume && (
                  <Typography color="error">{errors.resume as string}</Typography>
                )}
              </Box>

              <Box mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Application'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
