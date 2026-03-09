import { Router } from 'express';
import { dashboardProxy } from '../proxies/dashboard.proxy';

const router = Router();

router.use('/', dashboardProxy);

export default router;
