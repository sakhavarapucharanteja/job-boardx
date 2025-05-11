// src/pages/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Box, Typography } from '@mui/material';

interface LoginValues { email: string; password: string; }

const LoginSchema = Yup.object().shape({
  email:    Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (
    values: LoginValues,
    { setFieldError, setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      // 1) Log in & store token
      const { data: { token } } = await api.post('/login/login', values);
      localStorage.setItem('token', token);

      // 2) Fetch current user info
      const { data: user } = await api.get('/login/me');
      setUser(user);

      // 3) Redirect based on role
      if (user.role === 'job_seeker') {
        navigate('/jobs', { replace: true });
      } else {
        navigate('/employer/jobs', { replace: true });
      }
    } catch (err: any) {
      setFieldError('email', err.response?.data?.msg || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={4}>
        <Typography variant="h4" align="center">Login</Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                name="email"
                as={TextField}
                label="Email"
                fullWidth margin="normal"
                error={Boolean(errors.email && touched.email)}
                helperText={errors.email && touched.email && errors.email}
              />
              <Field
                name="password"
                as={TextField}
                type="password"
                label="Password"
                fullWidth margin="normal"
                error={Boolean(errors.password && touched.password)}
                helperText={errors.password && touched.password && errors.password}
              />
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in…' : 'Login'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
