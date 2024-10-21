import mongoose from "mongoose";

const userBookMatrix = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  ratings: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true,
      },
    },
  ],
});

const UserBookMatrix = mongoose.model("UserBookMatrix", userBookMatrix);

export default UserBookMatrix;
