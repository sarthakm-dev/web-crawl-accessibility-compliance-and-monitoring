import { Router } from 'express';
import { IssuesController } from '../controllers/issues.controller';

const router = Router();

router.get('/', IssuesController.getAll);
router.get('/:id', IssuesController.getById);
router.patch('/:id/status', IssuesController.updateStatus);
router.post('/:id/notes', IssuesController.addNote);

export default router;
