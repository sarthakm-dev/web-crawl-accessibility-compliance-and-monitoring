import { Router } from 'express';
import { SiteController } from '../controllers/site.controller';

const router = Router();

router.post('/', SiteController.createSite);
export default router;
