import mongoose from 'mongoose';
const userBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the book
  addedAt: { type: Date, default: Date.now },
});

export default mongoose.model('UserBook', userBookSchema);
