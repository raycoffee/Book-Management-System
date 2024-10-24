import express from "express";
import {
  register,
  signIn,
  updateUserGenres,
  logout,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/sign-in", signIn);
router.post("/logout", logout);

router.post("/genres", authenticateToken,updateUserGenres);

router.get("/isAuthenticated", authenticateToken, (req, res) => {
  res.status(200).json({
    isAuthenticated: true,
    user: req.user,
  });
});

export default router;
