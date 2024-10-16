// ReviewModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Rating,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

const ReviewModal = ({
  open,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  onSubmit,
}) => {
  const theme = useTheme(); // Use theme for palette and spacing

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
          padding: theme.spacing(2), // Add some internal padding for aesthetics
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>
          Write a Review
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Rating Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={1}
              size="large"
            />
            <Typography variant="body1" sx={{ ml: 2 }}>
              {rating > 0 ? `${rating} Star${rating > 1 ? 's' : ''}` : ''}
            </Typography>
          </Box>

          {/* Comment Input */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Add a comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2, // Slight rounding for modern look
              },
            }}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={onSubmit}
            fullWidth
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              padding: theme.spacing(1.5), // Make button taller
              borderRadius: 3, // Rounded button for aesthetics
              textTransform: 'none', // Disable uppercase for a friendly feel
            }}
          >
            Submit Review
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
