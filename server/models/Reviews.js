import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer_name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
});

export default mongoose.model('Review', reviewSchema);
