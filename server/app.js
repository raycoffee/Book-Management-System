import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use('/api/v1/books', bookRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

app.get('/', (req, res) => res.send('Book Management System API'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
