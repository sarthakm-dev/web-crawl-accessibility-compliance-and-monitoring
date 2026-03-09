import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

router.get('/summary', DashboardController.getSummary);
router.get('/trend', DashboardController.getTrend);
router.get('/issues-breakdown', DashboardController.getIssuesBreakdown);
router.get('/latest-crawls', DashboardController.getLatestCrawls);

export default router;
