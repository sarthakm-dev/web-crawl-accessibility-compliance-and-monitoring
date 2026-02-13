import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/me",authenticate,AuthController.me);
router.post("/refresh",AuthController.refresh);
router.post("/logout",AuthController.logout);
export default router;