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
import { getInternationalCourses } from '../../../container/courses/slice';

// ✅ Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().nullable(),
  location: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
  category: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one category is required')
    .required('Category is required'),
  status: Yup.string().required('Status is required'),

  image: Yup.mixed()
    .nullable()
    .test("fileSize", "Image must be less than 1MB", (value) => {
      if (!value) return true;
      return value.size <= 1 * 1024 * 1024;
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
  const { international } = useSelector((state) => state.courses);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getInternationalCourses());
  }, [dispatch]);

  useEffect(() => {
    if (editData?.image) {
      setPreviewImage(editData.image);
    } else {
      setPreviewImage(null);
    }
  }, [editData]);

  // ✅ Only non-domestic countries allowed
  const filteredCountries = countries.filter((country) => country.isDomestic === false);

  const initialValues = {
    name: editData?.name || '',
    location: editData?.location || '',
    country: editData?.country?._id || '',
    category: Array.isArray(editData?.category) ? editData.category : [],
    status: editData?.status || '',
    image: null,
    courses: editData?.courses?.map((c) => (typeof c === 'object' ? c._id : c)) || [],
    facilities: editData?.facilities || [],
    services: editData?.services || [],
    map: editData?.map || '',
    visible: editData?.visible !== undefined ? editData.visible : true,
    isDomestic: false,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit({
      ...values,
      courses: values.courses.map((c) => (typeof c === 'object' ? c._id : c)),
      category: values.category,
      isDomestic: false,
    });
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit International College' : 'Add New International College'}
      </DialogTitle>
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
                {/* College Name */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="College Name"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="location"
                    label="Location"
                    fullWidth
                    variant="outlined"
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                  />
                </Grid>

                {/* Country */}
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={touched.country && Boolean(errors.country)}
                  >
                    <InputLabel id="country-label">Country *</InputLabel>
                    <Field
                      as={Select}
                      name="country"
                      labelId="country-label"
                      value={values.country}
                      onChange={(e) => setFieldValue('country', e.target.value)}
                    >
                      {filteredCountries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.country && errors.country && (
                      <Typography color="error" variant="caption">
                        {errors.country}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Category (Multi-select) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={touched.category && Boolean(errors.category)}>
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
                    {touched.category && errors.category && (
                      <Typography color="error" variant="caption">
                        {errors.category}
                      </Typography>
                    )}
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
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={touched.courses && Boolean(errors.courses)}
                  >
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
                            const course = international.find((c) => c._id === courseId);
                            return course ? <Chip key={courseId} label={course.title} /> : null;
                          })}
                        </Box>
                      )}
                    >
                      {international.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                          {course.title}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.courses && errors.courses && (
                      <Typography color="error" variant="caption">
                        {errors.courses}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Domestic (Always Disabled) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="domestic-label">Domestic</InputLabel>
                    <Field as={Select} labelId="domestic-label" name="isDomestic" disabled>
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} sm={6}>
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
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                    {touched.image && errors.image && (
                      <Typography color="error" variant="caption">
                        {errors.image}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Image Preview */}
                {previewImage && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Preview:
                      </Typography>
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
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
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