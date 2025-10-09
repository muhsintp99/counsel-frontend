import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  Chip,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getCountry } from '../../../container/country/slice';
import { getDomesticCourses } from '../../../container/courses/slice';
import { getState } from '../../../container/states/slice';

// const validationSchema = Yup.object({
//   name: Yup.string().required('College name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   phone: Yup.string().required('Phone is required'),
//   address: Yup.string().required('Address is required'),
//   website: Yup.string().url('Invalid URL').nullable(),
//   desc: Yup.string().nullable(),
//   country: Yup.string().required('Country is required'),
//   state: Yup.string().nullable(),
//   category: Yup.array().of(Yup.string()).required('Select at least one category'),
//   status: Yup.string().required('Status is required'),
//   image: Yup.mixed().nullable(),
//   courses: Yup.array().of(Yup.string()).nullable(),
//   facilities: Yup.array().of(Yup.string()).nullable(),
//   services: Yup.array().of(Yup.string()).nullable(),
//   map: Yup.string().nullable(),
//   visible: Yup.boolean().nullable(),
// });


const validationSchema = Yup.object({
  name: Yup.string().required('College name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  website: Yup.string().url('Invalid URL').nullable(),
  desc: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
  state: Yup.string().nullable(),
  category: Yup.array().of(Yup.string()).required('Select at least one category'),
  status: Yup.string().required('Status is required'),

  // ✅ Image validations
  image: Yup.mixed()
    .nullable()
    .test("fileSize", "Image must be less than 1MB", (value) => {
      if (!value) return true; // allow null
      return value.size <= 1 * 1024 * 1024; // 1MB
    })
    .test("fileFormat", "Only image files are allowed", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
    // .test("aspectRatio", "Image must have 3:2 aspect ratio", (value) => {
    //   if (!value) return true;
    //   return new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       const img = new Image();
    //       img.onload = () => {
    //         const ratio = img.width / img.height;
    //         const expectedRatio = 3 / 2;
    //         const tolerance = 0.05; // 5% margin
    //         resolve(Math.abs(ratio - expectedRatio) <= tolerance);
    //       };
    //       img.onerror = () => resolve(false);
    //       img.src = e.target.result;
    //     };
    //     reader.readAsDataURL(value);
    //   });
    // }),

  courses: Yup.array().of(Yup.string()).nullable(),
  facilities: Yup.array().of(Yup.string()).nullable(),
  services: Yup.array().of(Yup.string()).nullable(),
  map: Yup.string().nullable(),
  visible: Yup.boolean().nullable(),
});


const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const dispatch = useDispatch();
  const { countries } = useSelector((state) => state.country);
  const { domestic } = useSelector((state) => state.courses);
  const { states } = useSelector((state) => state.states);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getState());
    dispatch(getDomesticCourses());
  }, [dispatch]);

  useEffect(() => {
    if (editData?.image) {
      setPreviewImage(editData.image);
    } else {
      setPreviewImage(null);
    }
  }, [editData]);

  const india = countries.find(c => c.name === 'India');

  const initialValues = {
    name: editData?.name || '',
    email: editData?.email || '',
    phone: editData?.phone || '',
    address: editData?.address || '',
    website: editData?.website || '',
    desc: editData?.desc || '',
    country: editData?.country?._id || india?._id || '',
    state: editData?.state?._id || '',
    category: editData?.category || [],   // ✅ multi-select
    status: editData?.status || '',
    image: null,
    courses: editData?.courses?.map((course) => course._id || course) || [],
    facilities: editData?.facilities || [],
    services: editData?.services || [],
    map: editData?.map || '',
    visible: editData?.visible !== undefined ? editData.visible : true,
    isDomestic: true,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit({
      ...values,
      courses: values.courses.map((c) => (typeof c === 'object' ? c._id : c)),
      category: Array.isArray(values.category) ? values.category : [values.category],
      isDomestic: true,
    });
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Domestic College' : 'Add New Domestic College'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Name */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="College Name *"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email *"
                    fullWidth
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Phone *"
                    fullWidth
                    variant="outlined"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Location *"
                    fullWidth
                    variant="outlined"
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>

                {/* Country (Fixed to India for domestic) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="country-label">Country *</InputLabel>
                    <Field
                      as={Select}
                      name="country"
                      labelId="country-label"
                      value={values.country}
                      onChange={(e) => setFieldValue('country', e.target.value)}
                      disabled
                    >
                      {india && (
                        <MenuItem value={india._id}>{india.name}</MenuItem>
                      )}
                    </Field>
                  </FormControl>
                </Grid>

                {/* State (Only if India) */}
                {values.country === india?._id && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="state-label">State</InputLabel>
                      <Field
                        as={Select}
                        labelId="state-label"
                        name="state"
                        value={values.state || ''}
                        onChange={(e) => setFieldValue('state', e.target.value)}
                      >
                        {states.map((state) => (
                          <MenuItem key={state._id} value={state._id}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                )}

                {/* Website */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="website"
                    label="Website"
                    fullWidth
                    variant="outlined"
                    error={touched.website && Boolean(errors.website)}
                    helperText={touched.website && errors.website}
                  />
                </Grid>

                {/* Category (Multi-Select) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-label">Category *</InputLabel>
                    <Field
                      as={Select}
                      name="category"
                      labelId="category-label"
                      multiple
                      value={values.category}
                      onChange={(e) => setFieldValue('category', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((cat) => (
                            <Chip key={cat} label={cat} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                      <MenuItem value="Graduate">Graduate</MenuItem>
                      <MenuItem value="PhD">PhD</MenuItem>
                      <MenuItem value="Diploma">Diploma</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="status"
                    label="Status *"
                    fullWidth
                    variant="outlined"
                    select
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="recommended">Recommended</MenuItem>
                    <MenuItem value="popular">Popular</MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                  </Field>
                </Grid>

                {/* Courses */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="courses-label">Courses</InputLabel>
                    <Field
                      as={Select}
                      name="courses"
                      labelId="courses-label"
                      multiple
                      value={values.courses}
                      onChange={(e) => setFieldValue('courses', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((courseId) => {
                            const course = domestic.find((c) => c._id === courseId);
                            return course ? <Chip key={courseId} label={course.title} /> : null;
                          })}
                        </Box>
                      )}
                    >
                      {domestic.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                          {course.title}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="desc"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} sm={12} lg={12}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      College Image
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue('image', file);

                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setPreviewImage(null);
                        }
                      }}
                    />
                    {/* ✅ Show Yup validation errors under field */}
                    {touched.image && errors.image && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                        {errors.image}
                      </Typography>
                    )}
                    {/* Optional static hint */}
                    <Typography variant="caption" color="textSecondary">
                      Image must be less than 1MB & 3:2 aspect ratio
                    </Typography>
                  </Box>
                </Grid>


                {/* Preview */}
                {previewImage && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2">Preview:</Typography>
                      <img
                        src={previewImage}
                        alt="College Preview"
                        style={{
                          width: 100,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid #ccc',
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ ml: 2 }}>
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
