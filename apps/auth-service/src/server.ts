import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from "../../../packages/shared-config/database";
import authRoutes from './routes/auth.routes';
import { initModels } from './models/init-models';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
  console.log('Database connected');
});
initModels();
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
