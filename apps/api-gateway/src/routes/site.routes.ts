import { Router } from 'express';
import { SiteController } from '../controllers/site.controller';

const router = Router();

router.post('/', SiteController.createSite);
router.get('/', SiteController.getAll);
router.get('/:id', SiteController.getById);
router.delete('/bulk', SiteController.bulkDelete);
router.delete('/:id', SiteController.deleteSite);

export default router;
