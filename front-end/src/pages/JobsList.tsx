// src/pages/JobsTable.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  CircularProgress,
  TablePagination,
  Backdrop,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Job {
  _id: string;
  title: string;
  company: string;
  employmentType?: string;
  location?: string;
  postedAt: string;
}

interface Application {
  _id: string;
  job: { _id: string };
  status: "pending" | "accepted" | "rejected";
}

export default function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<Job[]>("/jobs"),
      api.get<Application[]>("/applications/me"),
    ])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data);
        const m: Record<string, string> = {};
        appsRes.data.forEach((a) => {
          m[a.job._id] = a.status;
        });
        setApps(m);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 1) Client-side search over the entire jobs array
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) =>
      j.title.toLowerCase().includes(filter.toLowerCase()) ||
      j.company.toLowerCase().includes(filter.toLowerCase())
    );
  }, [jobs, filter]);

  // 2) Paginate the filtered list
  const paginatedJobs = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredJobs.slice(start, start + rowsPerPage);
  }, [filteredJobs, page]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Render action cell: status chip or apply button
  const renderAction = (job: Job) => {
    const status = apps[job._id];
    if (status) {
      let color: "default" | "success" | "error" = "default";
      if (status === "accepted") color = "success";
      if (status === "rejected") color = "error";
      return (
        <Chip
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          color={color}
        />
      );
    }
    return (
      <Button
        size="small"
        variant="contained"
        onClick={() => navigate(`/apply/${job._id}`)}
      >
        Apply
      </Button>
    );
  };

  return (
    <Box position="relative" p={2}>
      {/* Loader */}
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h5" gutterBottom>
        Jobs ({filteredJobs.length} of {jobs.length})
      </Typography>

      <TextField
        label="Search by title or company"
        value={filter}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Posted</TableCell>
              <TableCell align="right">Status / Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.employmentType || "—"}</TableCell>
                <TableCell>{job.location || "Remote"}</TableCell>
                <TableCell>
                  {format(new Date(job.postedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    View
                  </Button>
                  {renderAction(job)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredJobs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </Box>
  );
}
