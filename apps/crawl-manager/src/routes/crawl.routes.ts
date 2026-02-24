import { Router } from 'express';
import { CrawlController } from '../controllers/crawl.controllers';
import { authorize } from '@packages/shared-validation/rbac.validation';
import { authenticate } from '../middleware/crawl.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('crawl:trigger'),
  CrawlController.trigger
);

export default router;
