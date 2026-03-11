import { Router } from 'express';
import { CrawlController } from '../controllers/crawl.controllers';
import { authorize } from '@packages/shared-validation/rbac.validation';
import { authenticate } from '@packages/shared-utils/auth-middlewate';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('crawl:trigger'),
  CrawlController.trigger
);
router.get('/', authenticate, authorize('crawl:view'), CrawlController.getAll);
router.get(
  '/:id',
  authenticate,
  authorize('crawl:view'),
  CrawlController.getById
);
router.delete(
  '/bulk',
  authenticate,
  authorize('crawl:delete'),
  CrawlController.bulkDelete
);
export default router;
