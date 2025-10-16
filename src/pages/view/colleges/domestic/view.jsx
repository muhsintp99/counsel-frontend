import React from 'react';
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../../assets/style/commen';

const capitalize = (val) => {
  if (!val) return 'N/A';
  if (Array.isArray(val)) {
    return val.map((item) => (typeof item === 'string' ? item.charAt(0).toUpperCase() + item.slice(1) : item));
  }
  if (typeof val === 'string') {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  return String(val);
};

const View = ({ open, onClose, data }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '50%', md: '40%' },
        },
      }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        {/* Header */}
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>
              Domestic College Details
            </Typography>
          </Grid>
        </Box>

        {/* Content */}
        {data ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            {/* Left Section */}
            <Grid item xs={12} md={6}>
              {/* Image */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Image</strong></Typography>
                  <img
                    src={data.image || '/public/default/college.png'}
                    alt="college"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '160px',
                      borderRadius: '4px',
                      marginTop: '4px',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              </Box>

              {/* College Name */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>College Name</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.name)}</Typography>
                </Box>
              </Box>

              {/* Email */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Email</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.email || 'N/A'}</Typography>
                </Box>
              </Box>

              {/* Phone */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Phone</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.phone || 'N/A'}</Typography>
                </Box>
              </Box>

              {/* Address */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Address</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.address || 'N/A'}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Section */}
            <Grid item xs={12} md={6}>
              {/* Website */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Website</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.website || 'N/A'}</Typography>
                </Box>
              </Box>

              

              {/* Country */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Country</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.country?.name || 'N/A'}</Typography>
                </Box>
              </Box>

              {/* State */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>State</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{data.state?.name || 'N/A'}</Typography>
                </Box>
              </Box>

              {/* Category (List) */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Category</strong></Typography>
                  {Array.isArray(data.category) && data.category.length > 0 ? (
                    <List dense>
                      {data.category.map((cat, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={capitalize(cat)} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography sx={viewDrawerStyles.value}>N/A</Typography>
                  )}
                </Box>
              </Box>

              {/* Status */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Status</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>{capitalize(data.status)}</Typography>
                </Box>
              </Box>

              
              {/* Courses */}
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Courses</strong></Typography>
                  {Array.isArray(data.courses) && data.courses.length > 0 ? (
                    <List dense>
                      {data.courses.map((course) => (
                        <ListItem key={course._id}>
                          <ListItemText primary={course.title || 'N/A'} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography sx={viewDrawerStyles.value}>No courses assigned</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;