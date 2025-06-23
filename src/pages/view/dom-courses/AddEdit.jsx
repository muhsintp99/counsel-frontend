import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Chip,
  InputLabel,
  FormControl,
  Select,
  Box,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

const categoryOptions = ['Graduate', 'Postgraduate', 'Diploma', 'PhD', 'other'];

const AddEdit = ({ open, handleClose, editData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    duration: '',
    category: '',
    customCategory: '',
    mode: '',
    fees: '',
    syllabus: [],
    prerequisites: [],
    tags: [],
    image: null,
    isDomestic: true,
  });
  const [inputSyllabus, setInputSyllabus] = useState('');
  const [inputPrerequisites, setInputPrerequisites] = useState('');
  const [inputTags, setInputTags] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        customCategory: categoryOptions.includes(editData.category) ? '' : editData.category,
        category: categoryOptions.includes(editData.category) ? editData.category : 'other',
        image: null,
        isDomestic: editData.isDomestic !== undefined ? editData.isDomestic : true,
      });
      setImagePreview(editData.image || null);
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        duration: '',
        category: '',
        customCategory: '',
        mode: '',
        fees: '',
        syllabus: [],
        prerequisites: [],
        tags: [],
        image: null,
        isDomestic: true,
      });
      setInputSyllabus('');
      setInputPrerequisites('');
      setInputTags('');
      setImagePreview(null);
    }

    // Cleanup image preview URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [editData, imagePreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      if (files[0].size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      if (!files[0].type.match('image/*')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(files[0]));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : name === 'isDomestic' ? value === 'true' : value,
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    if (field === 'syllabus') setInputSyllabus(value);
    else if (field === 'prerequisites') setInputPrerequisites(value);
    else if (field === 'tags') setInputTags(value);
  };

  const handleAddToArray = (field) => {
    let newItem;
    if (field === 'syllabus') newItem = inputSyllabus.trim();
    else if (field === 'prerequisites') newItem = inputPrerequisites.trim();
    else if (field === 'tags') newItem = inputTags.trim();

    if (newItem) {
      const exists = formData[field].some(
        (item) => item.toLowerCase() === newItem.toLowerCase()
      );
      if (!exists) {
        setFormData((prev) => ({
          ...prev,
          [field]: [...prev[field], newItem],
        }));
        if (field === 'syllabus') setInputSyllabus('');
        else if (field === 'prerequisites') setInputPrerequisites('');
        else if (field === 'tags') setInputTags('');
      } else {
        toast.warn(`Item "${newItem}" already exists in ${field}`);
      }
    }
  };

  const handleDeleteFromArray = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddToArray(field);
    }
  };

  const handleFormSubmit = () => {
    if (
      !formData.title ||
      !formData.shortDescription ||
      !formData.fullDescription ||
      !formData.duration ||
      !formData.category ||
      !formData.mode ||
      !formData.fees ||
      (formData.category === 'other' && !formData.customCategory)
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    if (Number(formData.fees) <= 0) {
      toast.error('Fees must be a positive number');
      return;
    }

    const categoryToSave =
      formData.category === 'other' ? formData.customCategory : formData.category;
    onSubmit({ ...formData, category: categoryToSave });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{editData ? 'Edit Domestic Course' : 'Add Domestic Course'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.title}
              helperText={!formData.title ? 'Title is required' : ''}
              inputProps={{ 'aria-label': 'Course title' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Short Description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              fullWidth
              multiline
              maxRows={3}
              inputProps={{ maxLength: 300, 'aria-label': 'Short description' }}
              required
              error={!formData.shortDescription}
              helperText={!formData.shortDescription ? 'Short description is required' : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Full Description"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              error={!formData.fullDescription}
              helperText={!formData.fullDescription ? 'Full description is required' : ''}
              inputProps={{ 'aria-label': 'Full description' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.duration}
              helperText={!formData.duration ? 'Duration is required' : ''}
              inputProps={{ 'aria-label': 'Course duration' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                aria-label="Course category"
              >
                {categoryOptions.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.category === 'other' && (
            <Grid item xs={12}>
              <TextField
                label="Custom Category"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                fullWidth
                required
                error={formData.category === 'other' && !formData.customCategory}
                helperText={
                  formData.category === 'other' && !formData.customCategory
                    ? 'Custom category is required'
                    : ''
                }
                inputProps={{ 'aria-label': 'Custom category' }}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.mode}>
              <InputLabel id="mode-label">Mode</InputLabel>
              <Select
                labelId="mode-label"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                label="Mode"
                aria-label="Course mode"
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fees"
              name="fees"
              type="number"
              value={formData.fees}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.fees || Number(formData.fees) <= 0}
              helperText={
                !formData.fees
                  ? 'Fees is required'
                  : Number(formData.fees) <= 0
                  ? 'Fees must be positive'
                  : ''
              }
              inputProps={{ min: 0, 'aria-label': 'Course fees' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Syllabus (Press Enter to add)"
              value={inputSyllabus}
              onChange={(e) => handleArrayInputChange(e, 'syllabus')}
              onKeyPress={(e) => handleKeyPress(e, 'syllabus')}
              fullWidth
              helperText="Enter syllabus items one at a time and press Enter"
              inputProps={{ 'aria-label': 'Syllabus input' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.syllabus.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteFromArray('syllabus', index)}
                  aria-label={`Remove syllabus item ${item}`}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Prerequisites (Press Enter to add)"
              value={inputPrerequisites}
              onChange={(e) => handleArrayInputChange(e, 'prerequisites')}
              onKeyPress={(e) => handleKeyPress(e, 'prerequisites')}
              fullWidth
              helperText="Enter prerequisites one at a time and press Enter"
              inputProps={{ 'aria-label': 'Prerequisites input' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.prerequisites.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteFromArray('prerequisites', index)}
                  aria-label={`Remove prerequisite ${item}`}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tags (Press Enter to add)"
              value={inputTags}
              onChange={(e) => handleArrayInputChange(e, 'tags')}
              onKeyPress={(e) => handleKeyPress(e, 'tags')}
              fullWidth
              helperText="Enter tags one at a time and press Enter"
              inputProps={{ 'aria-label': 'Tags input' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.tags.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteFromArray('tags', index)}
                  aria-label={`Remove tag ${item}`}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="domestic-label">Domestic</InputLabel>
              <Select
                labelId="domestic-label"
                name="isDomestic"
                value={formData.isDomestic}
                onChange={handleChange}
                label="Domestic"
                disabled
                aria-label="Domestic status"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} aria-label="Cancel">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleFormSubmit}
          aria-label={editData ? 'Update course' : 'Create course'}
        >
          {editData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEdit;