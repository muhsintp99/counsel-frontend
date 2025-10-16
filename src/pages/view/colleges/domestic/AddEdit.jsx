// src/pages/colleges/domestic/AddEdit.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Chip, Box, Typography, Button,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getCountry } from '../../../container/country/slice';
import { getState } from '../../../container/states/slice';
import { getDomesticCourses } from '../../../container/courses/slice';

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  category: Yup.array().min(1, 'Select category').required(),
  status: Yup.string().required('Required'),
});

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const dispatch = useDispatch();
  const { countries } = useSelector((s) => s.country);
  const { states } = useSelector((s) => s.states);
  const { domestic } = useSelector((s) => s.courses);

  const isEdit = Boolean(editData?._id);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getState());
    dispatch(getDomesticCourses());
  }, [dispatch]);

  useEffect(() => {
    setPreview(editData?.image || null);
  }, [editData]);

  // Default India country object
  const india = countries.find((c) => c.name.toLowerCase() === 'india');

  const initialValues = {
    name: editData?.name || '',
    email: editData?.email || '',
    phone: editData?.phone || '',
    address: editData?.address || '',
    website: editData?.website || '',
    desc: editData?.desc || '',
    country: editData?.country?._id || india?._id || '',
    state: editData?.state?._id || '',
    category: editData?.category || [],
    status: editData?.status || '',
    courses: editData?.courses?.map((c) => c._id || c) || [],
    image: null,
    isDomestic: true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    await onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEdit ? 'Edit Domestic College' : 'Add Domestic College'}</DialogTitle>

      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, setFieldValue, errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Text Fields */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Name *"
                    fullWidth
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email *"
                    fullWidth
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Phone *"
                    fullWidth
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Address *"
                    fullWidth
                    error={touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                  />
                </Grid>

                {/* Country (read-only) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country *</InputLabel>
                    <Select
                      name="country"
                      value={values.country}
                      disabled
                    >
                      {countries.map((c) => (
                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* State */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Field as={Select} name="state">
                      {states.map((s) => (
                        <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                {/* Category */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category *</InputLabel>
                    <Field
                      as={Select}
                      name="category"
                      multiple
                      value={values.category}
                      onChange={(e) => setFieldValue('category', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((v) => <Chip key={v} label={v} />)}
                        </Box>
                      )}
                    >
                      <MenuItem value="Graduate">Graduate</MenuItem>
                      <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                      <MenuItem value="Diploma">Diploma</MenuItem>
                      <MenuItem value="PhD">PhD</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status *</InputLabel>
                    <Field as={Select} name="status">
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="recommended">Recommended</MenuItem>
                      <MenuItem value="popular">Popular</MenuItem>
                      <MenuItem value="regular">Regular</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                {/* Courses */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Courses</InputLabel>
                    <Field
                      as={Select}
                      name="courses"
                      multiple
                      value={values.courses}
                      onChange={(e) => setFieldValue('courses', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((id) => {
                            const c = domestic.find((x) => x._id === id);
                            return <Chip key={id} label={c?.title || id} />;
                          })}
                        </Box>
                      )}
                    >
                      {domestic.map((c) => (
                        <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                {/* Image */}
                <Grid item xs={12}>
                  <Typography>College Image</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue('image', file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {preview && (
                    <Box mt={2}>
                      <img src={preview} alt="preview" style={{ width: 160, borderRadius: 8 }} />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;
