import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addState, deleteState, getState, updateState } from '../../container/states/slice';
import { getCountry } from '../../container/country/slice';
import { StyledDataGrid } from '../../../assets/style/index';
import { DeleteOutlined, EyeOutlined, FormOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Typography, Box, TextField, useMediaQuery, InputAdornment, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import View from './view';
import AddEdit from './AddEdit';
import DeleteModel from '../../../utils/defult/DeleteModel';

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const dispatch = useDispatch();
  const { states = [], loading = false, error = null } = useSelector((state) => state.states || {});
  const { countries } = useSelector((state) => state.country || {});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = "States";

  useEffect(() => {
    dispatch(getState());
    dispatch(getCountry());
  }, [dispatch]);

  const handleView = (row) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleNewClick = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setDeleteData(row);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = (data) => {
    if (data && data._id) {
      dispatch(deleteState({ id: data._id }));
      setOpenDeleteDialog(false);
      setDeleteData(null);
    }
  };

  const handleSubmitForm = (values) => {
    const payload = {
      country: values.country || '',
      name: values.name || '',
      code: values.code?.toUpperCase() || '',
      desc: values.desc || '',
      index: values.index || 1,
      isActive: values.isActive !== undefined ? values.isActive : true,
    };

    if (editData && editData._id) {
      dispatch(updateState({ id: editData._id, data: payload }));
    } else {
      dispatch(addState(payload));
    }

    setOpenDialog(false);
    setEditData(null);
  };

  const rows = states
    .filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        (item.name || '').toLowerCase().includes(query) ||
        (item.code || '').toLowerCase().includes(query) ||
        (item.desc || '').toLowerCase().includes(query) ||
        (item.country?.name || '').toLowerCase().includes(query)
      );
    })

    .map((item, index) => ({ ...item, id: index + 1 || item._id }));

  const columns = [
    { field: 'id', headerName: 'S.No', flex: 1 },
    { field: 'name', headerName: 'State Name', flex: 1 },
    { field: 'code', headerName: 'State Code', flex: 0.8 },
    {
      field: 'country',
      headerName: 'Country',
      flex: 1,
      valueGetter: (params) => {
        return `${params.name}-${params.code}`;
      },
    },

    {
      field: 'desc',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <EyeOutlined style={pageStyles.viewIcon} onClick={() => handleView(params.row)} />
            <FormOutlined style={pageStyles.editIcon} onClick={() => handleEdit(params.row)} />
            <DeleteOutlined style={pageStyles.deleteIcon} onClick={() => handleDelete(params.row)} />
          </>
        );
      },
    },
  ];

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: "#234155", fontWeight: 600 }}>{rows.length} {title}</span> are listed below
      </Typography>

      <Grid container spacing={2} sx={pageStyles.searchbox}>
        <Grid item xs={12} sm={6} md={8}>
          <TextField
            fullWidth
            placeholder="Search by Name, Code, Description, or Country"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined style={pageStyles.newButtonIcon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={pageStyles.newButtonBox}>
          <Button
            variant="contained"
            fullWidth={isMobile}
            sx={pageStyles.newButton}
            onClick={handleNewClick}
          >
            <PlusCircleOutlined style={pageStyles.newButtonIcon} />
            New
          </Button>
        </Grid>
      </Grid>

      {loading && <Typography sx={{ mt: 2 }}>Loading states...</Typography>}
      {error && (
        <Typography sx={{ mt: 2, color: 'red' }}>
          Error: {error || 'An unexpected error occurred'}
        </Typography>
      )}
      {!loading && !error && rows.length === 0 && (
        <Typography sx={{ mt: 2 }}>No-states found matching your search.</Typography>
      )}

      {!loading && !error && rows.length > 0 && (
        <StyledDataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        />
      )}

      <AddEdit
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditData(null);
        }}
        onSubmit={handleSubmitForm}
        editData={editData}
        countries={countries}
      />
      <View open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} data={selectedRow} />
      <DeleteModel
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeleteData(null);
        }}
        data={deleteData}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Index;