import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetailPage from "./pages/JobDetailPage";
import PrivateRoute from "./components/PrivateRoute";
import JobsTable from "./pages/JobsList";
import ApplyPage from "./pages/ApplyPage";
import ProfilePage from "./pages/Profile";
import HomeRedirect from "./components/HomeRedirect";
import CreateJobPage from "./pages/CreateJobPage";
import EditJobPage from "./pages/EditJobPage";
import ApplicantsPage from "./pages/ApplicationsPage";
import ManageJobsPage from "./pages/ManageJobsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import JobApplicantsPage from "./pages/JobApplicantsPage";

const App: React.FC = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/jobs"
        element={
          <PrivateRoute>
            <JobsTable />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <PrivateRoute>
            <JobDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/apply/:id"
        element={
          <PrivateRoute>
            <ApplyPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <PrivateRoute allowedRoles={["job_seeker"]}>
            <MyApplicationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/jobs/:jobId/applicants"
        element={
          <PrivateRoute allowedRoles={["employer"]}>
            <JobApplicantsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/jobs"
        element={
          <PrivateRoute allowedRoles={["employer"]}>
            <ManageJobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/jobs/create"
        element={
          <PrivateRoute allowedRoles={["employer"]}>
            <CreateJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/jobs/edit/:id"
        element={
          <PrivateRoute allowedRoles={["employer"]}>
            <EditJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/jobs/:id/applicants"
        element={
          <PrivateRoute allowedRoles={["employer"]}>
            <ApplicantsPage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<HomeRedirect />} />
    </Routes>
  </Layout>
);

export default App;
