import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favoriteGenres: { type: [String], default: [] }, // Store genres as an array of strings
});

export default mongoose.model('User', userSchema);
