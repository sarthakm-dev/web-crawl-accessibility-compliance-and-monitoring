import { Router } from 'express';
import { dashboardProxy } from '../proxies/dashboard.proxy';
// router for dashboard endpoint
const router = Router();

router.use('/', dashboardProxy);

export default router;
