import mongoose from "mongoose";

const UserBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  addedAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserBook", UserBookSchema);
