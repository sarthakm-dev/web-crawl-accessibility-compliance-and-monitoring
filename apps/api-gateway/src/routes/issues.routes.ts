import { Router } from 'express';
import { issuesProxy } from '../proxies/issues.proxy';

const router = Router();

router.use('/', issuesProxy);

export default router;
