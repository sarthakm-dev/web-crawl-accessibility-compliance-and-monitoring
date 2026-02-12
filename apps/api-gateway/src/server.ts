import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/openapi.json";
import authRoutes from "./routes/auth.routes";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth",authRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
  console.log(`API Gateway Running on port ${PORT}`);
});
export default app;