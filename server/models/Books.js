import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // To store the user's name
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  published_date: { type: Date },
  ISBN: { type: String, unique: true }, // Unique constraint ensures no duplicate books
  genre: { type: String, required: true },
  thumbnail: { type: String, required: true },
  reviews: [reviewSchema], // Keeping reviews here if you want to associate reviews with the book directly
});

export default mongoose.model('Book', bookSchema);

