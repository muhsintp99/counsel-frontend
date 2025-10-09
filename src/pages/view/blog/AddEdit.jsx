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
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (editData?.image) {
      setPreviewImage(editData.image);
      setFileName(editData.image.split('/').pop());
    } else {
      setPreviewImage(null);
      setFileName('');
    }
  }, [editData]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    shortDesc: Yup.string().required('Short Description is required'),
    fullDesc: Yup.string().required('Full Description is required'),
    link: Yup.string()
      .nullable()
      .matches(
        /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-\.]*)*\/?$/,
        { message: 'Enter a valid URL', excludeEmptyString: true }
      ),
    image: Yup.mixed().test(
      'fileType',
      'Only image files are allowed (jpeg, jpg, png, gif)',
      function (value) {
        if (!value && editData?.image) return true;
        if (!value && !editData) return false;
        if (!value) return true;
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
      }
    ),
  });


  const initialValues = {
    title: editData?.title || '',
    shortDesc: editData?.shortDesc || '',
    fullDesc: editData?.fullDesc || '',
    link: editData?.link || '',
    image: null,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // If editing and no new file selected, keep old image
    if (isEdit && !values.image && previewImage) {
      values.image = previewImage;
    }
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>

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
                {/* Title */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="title"
                    label="Title *"
                    fullWidth
                    variant="outlined"
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>

                {/* Short Description */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="shortDesc"
                    label="Short Description *"
                    fullWidth
                    variant="outlined"
                    error={touched.shortDesc && Boolean(errors.shortDesc)}
                    helperText={touched.shortDesc && errors.shortDesc}
                  />
                </Grid>

                {/* Full Description */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="fullDesc"
                    label="Full Description *"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    error={touched.fullDesc && Boolean(errors.fullDesc)}
                    helperText={touched.fullDesc && errors.fullDesc}
                  />
                </Grid>

                {/* Link */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="link"
                    label="Link"
                    fullWidth
                    variant="outlined"
                    placeholder="https://example.com"
                    error={touched.link && Boolean(errors.link)}
                    helperText={touched.link && errors.link}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Blog Image {isEdit ? '(optional, current image shown below)' : '*'}
                    </Typography>

                    {/* Show existing/new file name */}
                    {/* <TextField
                      fullWidth
                      variant="outlined"
                      value={fileName || ''}
                      placeholder="No file selected"
                      InputProps={{ readOnly: true }}
                    /> */}

                    {/* Actual file input */}
                    <input
                      type="file"
                      accept="image/*"
                      // value={fileName || ''}
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue('image', file);
                        if (file) {
                          setFileName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => setPreviewImage(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />

                    {/* Remove Image Button */}
                    {previewImage && (
                      <Button
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setPreviewImage(null);
                          setFileName('');
                          setFieldValue('image', null);
                        }}
                      >
                        Remove Image
                      </Button>
                    )}
                  </Box>
                </Grid>

                {/* Preview */}
                {previewImage && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Preview:
                      </Typography>
                      <img
                        src={previewImage}
                        alt="Blog Preview"
                        style={{
                          width: 100,
                          height: 100,
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
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ ml: 2 }}
              >
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
