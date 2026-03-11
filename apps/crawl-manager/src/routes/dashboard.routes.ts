import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '@packages/shared-utils/auth-middlewate';

const router = Router();

router.get('/summary', authenticate, DashboardController.getSummary);
router.get('/trend', authenticate, DashboardController.getTrend);
router.get(
  '/issues-breakdown',
  authenticate,
  DashboardController.getIssuesBreakdown
);
router.get('/latest-crawls', authenticate, DashboardController.getLatestCrawls);

export default router;
