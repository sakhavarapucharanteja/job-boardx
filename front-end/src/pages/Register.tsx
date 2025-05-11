// src/pages/Register.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import api from '../api';


interface RegisterValues {
  name:     string;
  email:    string;
  password: string;
  role:     'job_seeker' | 'employer';
}

const RegisterSchema = Yup.object().shape({
  name:     Yup.string().required('Required'),
  email:    Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
  role:     Yup.string()
               .oneOf(['job_seeker','employer'], 'Select a user type')
               .required('Required'),
});

export default function RegisterPage() {
  const navigate = useNavigate();

  const initialValues: RegisterValues = {
    name:     '',
    email:    '',
    password: '',
    role:     'job_seeker'
  };

  const handleSubmit = async (
    values: RegisterValues,
    { setSubmitting, setFieldError }: FormikHelpers<RegisterValues>
  ) => {
    try {
      // send name, email, password, role to backend
      await api.post('/login/register', values);
      navigate('/login');
    } catch (err: any) {
      setFieldError(
        'email',
        err.response?.data?.msg || 'Registration failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, handleChange, values }) => (
            <Form noValidate>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                margin="normal"
                value={values.name}
                onChange={handleChange}
                error={Boolean(errors.name && touched.name)}
                helperText={errors.name && touched.name && errors.name}
              />

              <TextField
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                value={values.email}
                onChange={handleChange}
                error={Boolean(errors.email && touched.email)}
                helperText={errors.email && touched.email && errors.email}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={values.password}
                onChange={handleChange}
                error={Boolean(errors.password && touched.password)}
                helperText={errors.password && touched.password && errors.password}
              />

              <TextField
                name="role"
                label="Register As"
                select
                fullWidth
                margin="normal"
                value={values.role}
                onChange={handleChange}
                error={Boolean(errors.role && touched.role)}
                helperText={errors.role && touched.role && errors.role}
              >
                <MenuItem value="job_seeker">Job Seeker</MenuItem>
                <MenuItem value="employer">Employer</MenuItem>
              </TextField>

              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering…' : 'Register'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
