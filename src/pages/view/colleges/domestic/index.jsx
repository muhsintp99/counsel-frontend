// src/pages/colleges/domestic/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  useMediaQuery,
} from '@mui/material';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../../assets/style/commen';
import DeleteModel from '../../../../utils/defult/DeleteModel';
import AddEdit from './AddEdit';
import View from './View';
import {
  getColleges,
  addCollege,
  updateCollege,
  deleteCollege,
} from '../../../container/colleges/domestic/slice';

const capitalize = (val) => (val ? val.charAt(0).toUpperCase() + val.slice(1) : '');

const DomesticColleges = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { colleges, pagination, loading, error } = useSelector((state) => state.domesticColleges);

  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, college: null });

  const title = 'Domestic Colleges';

  // 🟢 Load Colleges
  useEffect(() => {
    dispatch(getColleges({ isDomestic: true, page: 1, limit: 50 }));
  }, [dispatch]);

  // 🟡 Dialog Handlers
  const handleOpenDialog = (college = null) => {
    setSelectedCollege(college);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCollege(null);
  };

  // 🟢 View Drawer
  const handleView = (college) => {
    setViewData(college);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setViewData(null);
  };

  // 🔴 Delete Dialog
  const handleOpenDeleteDialog = (college) => {
    setDeleteDialog({ open: true, college });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, college: null });
  };

  const handleDeleteConfirm = async (college) => {
    await dispatch(deleteCollege(college._id));
    await dispatch(getColleges({ isDomestic: true, page: 1, limit: 50 }));
    handleCloseDeleteDialog();
  };

  // 🟠 Add / Edit Submit
  const handleSubmit = async (values) => {
    if (selectedCollege?._id) {
      await dispatch(updateCollege({ id: selectedCollege._id, ...values }));
    } else {
      await dispatch(addCollege(values));
    }
    await dispatch(getColleges({ isDomestic: true, page: 1, limit: 50 }));
    handleCloseDialog();
  };

  // 🔍 Filtered Search
  const filteredColleges = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return colleges.filter((college) =>
      [college.name, college.email, college.phone, college.country?.name, college.address]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [colleges, searchQuery]);

  const totalColleges = pagination?.total || colleges.length;

  return (
    <Box sx={pageStyles.mainBox}>
      {/* 🧭 Header */}
      <Typography variant="h4" sx={pageStyles.title}>
        {title}
      </Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <strong>{totalColleges}</strong> {title} are listed below
      </Typography>

      {/* ❗ Error */}
      {error && (
        <Typography color="error" sx={{ mt: 2, p: 1, backgroundColor: '#ffebee' }}>
          {error}
        </Typography>
      )}

      {/* 🔍 Search & Add */}
      <Box sx={pageStyles.searchbox}>
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
          sx={{ ...pageStyles.searchInput, maxHeight: 38 }}
        />
        <Button
          variant="contained"
          sx={{ ml: 2, mt: isMobile ? 1 : 0 }}
          onClick={() => handleOpenDialog()}
        >
          Add College
        </Button>
      </Box>

      {/* 🧾 List */}
      {loading && <Typography sx={{ mt: 2 }}>Loading...</Typography>}
      {!loading && filteredColleges.length === 0 && (
        <Typography sx={{ mt: 2 }}>No colleges found.</Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredColleges.map((college) => (
          <Grid item xs={12} sm={6} md={4} key={college._id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="140"
                image={college.image || '/public/default/college.png'}
                alt={college.name}
              />
              <CardContent>
                <Typography variant="h6">{college.name}</Typography>
                <Typography>Email: {college.email || 'N/A'}</Typography>
                <Typography>Phone: {college.phone || 'N/A'}</Typography>
                <Typography>Country: {college.country?.name || 'N/A'}</Typography>
                <Typography>Status: {capitalize(college.status)}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-around' }}>
                <Button startIcon={<EyeOutlined />} onClick={() => handleView(college)}>
                  View
                </Button>
                <Button startIcon={<EditOutlined />} onClick={() => handleOpenDialog(college)}>
                  Edit
                </Button>
                <Button
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={() => handleOpenDeleteDialog(college)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ➕ Add/Edit Dialog */}
      <AddEdit open={openDialog} onClose={handleCloseDialog} onSubmit={handleSubmit} editData={selectedCollege} />

      {/* 👁️ View Drawer */}
      <View open={isViewOpen} onClose={handleViewClose} data={viewData} />

      {/* ❌ Delete Modal */}
      <DeleteModel
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        data={deleteDialog.college}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default DomesticColleges;
