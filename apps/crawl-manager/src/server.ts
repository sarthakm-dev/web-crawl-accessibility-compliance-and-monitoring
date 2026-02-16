import { initModels } from './models';
import { initPublisher } from './publishers/crawl.publishers';
import crawlRoutes from './routes/crawl.routes';
import siteRoutes from "./routes/site.routes";
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
async function crawlManager() {
  initModels();
  await initPublisher();

  const app = express();  

  app.use(express.json());
  app.use("/sites",siteRoutes)
  app.use('/crawl', crawlRoutes);
  app.listen(3002,()=>{
    console.log(`Crawl Manager running on port 3002`);
  });
}
crawlManager();
