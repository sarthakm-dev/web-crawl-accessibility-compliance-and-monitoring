import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate-schema";
import { signupSchema, loginSchema, refreshSchema } from "../../../../packages/shared-validation/auth.schema"
import { authenticate } from "../middlewares/validate";

const router = Router();

router.post("/signup",validate(signupSchema), AuthController.signup);
router.post("/login",validate(loginSchema), AuthController.login);
router.post("/refresh",validate(refreshSchema),AuthController.refresh);
router.post("/logout",AuthController.logout);
router.get("/me",authenticate, AuthController.me);

export default router;