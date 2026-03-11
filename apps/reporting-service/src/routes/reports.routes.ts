import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { authenticate } from '@packages/shared-utils/auth-middlewate';
const router = Router();

router.get('/site-summary', authenticate, ReportsController.siteSummary);
router.get('/issues', authenticate, ReportsController.issuesBreakdown);
router.get('/top-pages', authenticate, ReportsController.topPages);
router.get('/issues-table', authenticate, ReportsController.issuesTable);

router.post('/export', authenticate, ReportsController.exportReport);

export default router;
