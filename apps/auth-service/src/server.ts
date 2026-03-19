import express from 'express';
import { sequelize } from '@packages/shared-config/database';
import authRoutes from './routes/auth.routes';
import { initModels } from '@packages/shared-models/init-models';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from '@packages/shared-config/env';
import { jsonValidation } from '@packages/shared-validation/json.validation';
import rateLimit from 'express-rate-limit';
import { logger } from '@packages/shared-config/logger';

// Setup rate limiter
const authLimiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: Number(env.MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

const frontendUrl = env.FRONTEND_URL;
const gatewayUrl = env.API_GATEWAY_URL;
// handle missing .env variables
if (!frontendUrl || !gatewayUrl) {
  throw new Error(
    'Missing required environment variables for CORS configuration.'
  );
}
// setup cors for frontend
app.use(
  cors({
    origin: [frontendUrl, gatewayUrl],
    credentials: true,
  })
);
// add morgan logger
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(jsonValidation());
app.set('trust proxy', 1);
app.use('/api/auth', authLimiter, authRoutes);

const PORT = env.AUTH_PORT || 5000;

sequelize.authenticate().then(() => {
  logger.info('Database connected');
});

initModels();
app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});
