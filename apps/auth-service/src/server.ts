import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from '@packages/shared-config/database';
import authRoutes from './routes/auth.routes';
import { initModels } from '@packages/shared-models/init-models';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { jsonValidation } from '@packages/shared-validation/json.validation';
import rateLimit from 'express-rate-limit';
dotenv.config();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

const frontendUrl = process.env.FRONTEND_URL;
const gatewayUrl = process.env.API_GATEWAY_URL;

if (!frontendUrl || !gatewayUrl) {
  throw new Error(
    'Missing required environment variables for CORS configuration.'
  );
}

app.use(
  cors({
    origin: [frontendUrl, gatewayUrl],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(jsonValidation());
app.use('/api/auth', authLimiter, authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
  console.log('Database connected');
});

initModels();
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
