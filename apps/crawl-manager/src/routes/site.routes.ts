import { Router } from 'express';
import { SiteController } from '../controllers/site.controller';
import { authorize } from '@packages/shared-validation/rbac.validation';
import { authenticate } from '@packages/shared-utils/auth-middlewate';
const router = Router();
router.post(
  '/',
  authenticate,
  authorize('site:create'),
  SiteController.createSite
);
router.get('/', authenticate, authorize('site:view'), SiteController.getAll);
router.get(
  '/:id',
  authenticate,
  authorize('site:view'),
  SiteController.getById
);
router.delete(
  '/bulk',
  authenticate,
  authorize('site:delete'),
  SiteController.bulkDeleteSites
);
router.delete(
  '/:id',
  authenticate,
  authorize('site:delete'),
  SiteController.deleteSite
);
export default router;
