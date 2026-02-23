import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.json';
import authRoutes from './routes/auth.routes';
import siteRoutes from './routes/site.routes';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(helmet());
app.use('/api/auth', authRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway Running on port ${PORT}`);
});
export default app;
