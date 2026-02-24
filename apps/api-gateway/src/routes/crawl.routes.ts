import { Router } from 'express';
import { CrawlController } from '../controllers/crawl.controller';

const router = Router();

router.post('/', CrawlController.startCrawl);
router.get('/', CrawlController.getAll);
router.get('/:id', CrawlController.getById);
export default router;
