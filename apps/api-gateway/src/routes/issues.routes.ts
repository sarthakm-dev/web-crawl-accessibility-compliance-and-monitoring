import { Router } from 'express';
import { issuesProxy } from '../proxies/issues.proxy';
// router for issues endpoint
const router = Router();

router.use('/', issuesProxy);

export default router;
