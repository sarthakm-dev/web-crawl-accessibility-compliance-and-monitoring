import { Router } from 'express';
import { authProxy } from '../proxies/auth.proxy';
// router for auth endpoint
const router = Router();

router.use('/', authProxy);

export default router;
