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
export default router;
