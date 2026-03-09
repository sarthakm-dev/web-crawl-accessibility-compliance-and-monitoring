import { Router } from 'express';
import { authProxy } from '../proxies/auth.proxy';

const router = Router();

router.use('/', authProxy);

export default router;
