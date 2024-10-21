import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  published_date: { type: Date },
  ISBN: { type: String, unique: true },
  genre: { type: String, required: true },
  thumbnail: { type: String, required: true },
});

export default mongoose.model("Book", bookSchema);
