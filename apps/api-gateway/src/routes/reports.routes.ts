import { Router } from 'express';
import { reportsProxy } from '../proxies/reports.proxy';

const router = Router();

router.use('/', reportsProxy);

export default router;
