import { Router } from 'express';
import { SiteController } from '../controllers/site.controller';
import { authorize } from '@packages/shared-validation/rbac.validation';
import { authenticate } from '../middleware/crawl.middleware';
const router = Router();
router.post(
  '/',
  authenticate,
  authorize('site:create'),
  SiteController.createSite
);
router.get('/', authenticate, SiteController.getAll);
router.get('/:id', authenticate, SiteController.getById);
export default router;
