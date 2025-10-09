import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import FormatDate from '../../../utils/defult/FormatDate';

const View = ({ open, onClose, data }) => {
  const { loading, error } = useSelector((state) => state.enquiries);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper to safely extract field values
  const safeGet = (field) => (field ? field : 'N/A');

  // Function to get chip color based on lead quality
  const getLeadQualityColor = (quality) => {
    switch (quality) {
      case 'High':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'error';
      default:
        return 'default';
    }
  };

  // Function to get chip color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'info';
      case 'Closed':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="view-enquiry-dialog-title"
      PaperProps={{
        sx: {
          margin: isMobile ? 1 : 3,
          maxHeight: '90vh',
          borderRadius: 2,
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle id="view-enquiry-dialog-title" sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
        Enquiry Details - {safeGet(data.enqNo)}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: isMobile ? 2 : 3, overflowY: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : data ? (
          <Box>
            {/* --- Top Card Section --- */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="h6">{safeGet(data.fName)}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="h6">
                      {data.mobile ? (
                        <a
                          href={`tel:${data.mobile}`}
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                          }}
                        >
                          {data.mobile}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                      {data.email ? (
                        <a
                          href={`mailto:${data.email}`}
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                          }}
                        >
                          {data.email}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="h6">{safeGet(data.location)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Divider sx={{ my: 2 }} />

            {/* --- Enquiry Info Section --- */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Enquiry Information
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table>
                <TableBody>
                  <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                      Lead Quality
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={safeGet(data.leadQuality)}
                        color={getLeadQualityColor(safeGet(data.leadQuality))}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Course
                    </TableCell>
                    <TableCell>
                      {typeof data.course === 'object'
                        ? data.course?.title || 'N/A'
                        : safeGet(data.course)}
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      School
                    </TableCell>
                    <TableCell>
                      {typeof data.school === 'object'
                        ? data.school?.name || 'N/A'
                        : safeGet(data.school)}
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Status
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={safeGet(data.status)}
                        color={getStatusColor(safeGet(data.status))}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Enquiry Description
                    </TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>
                      {safeGet(data.enqDescp)}
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Remarks
                    </TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>
                      {safeGet(data.remarks)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
          </Box>
        ) : (
          <Typography>No data available</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default View;