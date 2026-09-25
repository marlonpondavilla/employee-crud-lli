import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { testConnection } from './config/db';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employees.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', async (_req, res) => {
  const dbOk = await testConnection();
  res.json({
    status: 'ok',
    db: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});