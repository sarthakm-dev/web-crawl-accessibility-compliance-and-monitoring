import { Router } from 'express';
import { sitesProxy } from '../proxies/sites.proxy';
// router for sites endpoint
const router = Router();

router.use('/', sitesProxy);

export default router;
