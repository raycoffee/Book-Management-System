import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  published_date: { type: Date },
  ISBN: { type: String },
  genre: { type: String, required: true },
  thumbnail: { type: String, required: true }, // New field for thumbnail URL
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Book', bookSchema);
