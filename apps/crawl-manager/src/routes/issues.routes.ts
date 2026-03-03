import { Router } from 'express';
import { IssuesController } from '../controllers/issues.controller';
import { authenticate } from '../middleware/crawl.middleware';

const router = Router();

router.get('/', authenticate, IssuesController.getAll);
router.get('/:id', authenticate, IssuesController.getById);
router.patch('/:id/status', authenticate, IssuesController.updateStatus);
router.post('/:id/notes', authenticate, IssuesController.addNote);

export default router;
