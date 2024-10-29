import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://34.47.130.229", 
      "34.47.130.229", 
      "http://34.47.130.229:80", 
      "34.47.130.229:80", 
      "http://34.47.130.229:3001",
      "34.47.130.229:3001",
      "http://localhost",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.get("/", (req, res) => res.send("Book Management System API"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
