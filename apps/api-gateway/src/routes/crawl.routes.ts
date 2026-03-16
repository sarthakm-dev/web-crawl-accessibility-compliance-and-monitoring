import { Router } from 'express';
import { crawlProxy } from '../proxies/crawl.proxy';
// router for crawl endpoint
const router = Router();

router.use('/', crawlProxy);

export default router;
