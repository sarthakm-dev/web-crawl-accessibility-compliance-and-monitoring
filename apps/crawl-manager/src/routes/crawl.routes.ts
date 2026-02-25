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
router.get('/', authenticate, CrawlController.getAll);
router.get('/:id', authenticate, CrawlController.getById);
export default router;
