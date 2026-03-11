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
dotenv.config();

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
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
  console.log('Database connected');
});

initModels();
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
