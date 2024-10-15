import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';  // Ensure user routes are included
import recommendationRoutes from './routes/recommendationRoutes.js';  // For recommendations

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route handling with versioning
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// Health check route
app.get('/', (req, res) => res.send('Book Management System API'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
