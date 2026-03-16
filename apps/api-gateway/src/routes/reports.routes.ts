import { Router } from 'express';
import { reportsProxy } from '../proxies/reports.proxy';
// router for reports endpoint
const router = Router();

router.use('/', reportsProxy);

export default router;
