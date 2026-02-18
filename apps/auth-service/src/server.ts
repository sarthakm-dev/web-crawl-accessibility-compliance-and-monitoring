import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from '@packages/shared-config/database';
import authRoutes from './routes/auth.routes';
import { initModels } from './models/init-models';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
dotenv.config();

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4000'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
  console.log('Database connected');
});

initModels();
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
