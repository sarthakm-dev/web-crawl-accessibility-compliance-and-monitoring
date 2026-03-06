import { Router } from 'express';
import { IssuesController } from '../controllers/issues.controller';
import { authenticate } from '../middleware/crawl.middleware';
import { authorize } from '@packages/shared-validation/rbac.validation';

const router = Router();

router.get('/', authenticate, authorize('issue:view'), IssuesController.getAll);
router.get(
  '/:id',
  authenticate,
  authorize('issue:view'),
  IssuesController.getById
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('issue:update'),
  IssuesController.updateStatus
);
router.post(
  '/:id/notes',
  authenticate,
  authorize('issue:update'),
  IssuesController.addNote
);

export default router;
