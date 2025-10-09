import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Grid, Typography, FormControlLabel, Checkbox,
  MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  country: Yup.string().required('Country is required'),
  name: Yup.string().required('State name is required'),
  code: Yup.string()
    .required('State code is required')
    .min(2, 'Code must be at least 2 characters')
    .max(5, 'Code must be at most 5 characters'),
  desc: Yup.string(),
  isActive: Yup.boolean().required('Status is required'),
});

const AddEdit = ({ open, onClose, onSubmit, editData, countries }) => {
  const isEdit = Boolean(editData && editData._id);
  const defaultIndia = countries.find((c) => c.name?.toLowerCase() === 'india');

  const initialValues = {
    country: isEdit
      ? editData?.country?._id
      : defaultIndia?._id || countries[0]?._id || '',
    name: editData?.name || '',
    code: editData?.code || '',
    desc: editData?.desc || '',
    isActive: editData?.isActive !== undefined ? editData.isActive : true,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    values.code = values.code?.toUpperCase();
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit State' : 'Add New State'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country *</InputLabel>
                    <Field
                      as={Select}
                      name="country"
                      label="Country *"
                      disabled={defaultIndia?._id === initialValues.country}
                      error={touched.country && Boolean(errors.country)}
                    >
                      {countries.map((country) => (
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
                    {defaultIndia?._id === initialValues.country && (
                      <Typography variant="caption" sx={{ color: 'gray' }}>
                        Country is set to India by default and cannot be changed.
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="State Name *"
                    placeholder="State Name"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="code"
                    placeholder="State Code (e.g., KA, KL)"
                    label="State Code (e.g., KA, KL) *"
                    fullWidth
                    variant="outlined"
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="desc"
                    placeholder="Description"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    error={touched.desc && Boolean(errors.desc)}
                    helperText={touched.desc && errors.desc}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={FormControlLabel}
                    name="isActive"
                    control={<Checkbox checked={values.isActive} />}
                    label="Active"
                    onChange={(e) => setFieldValue('isActive', e.target.checked)}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" sx={{ ml: 2 }}>
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;
