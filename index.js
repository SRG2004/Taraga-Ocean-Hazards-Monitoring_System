
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './src/api/auth.js';

dotenv.config();

const app = express();
// Use port 3001 for the backend API to avoid conflict with the frontend dev server
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.listen(port, 'localhost', () => {
  console.log(`✅ Backend server is running in mock mode on localhost:${port}`);
});
