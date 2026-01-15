import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import * as authControllers from "../controllers/authController.js";

const router = Router();

router.post("/register", ctrlWrapper(authControllers.registerUserController));
router.post("/login", ctrlWrapper(authControllers.loginController));
router.post("/logout", ctrlWrapper(authControllers.logoutController));
router.post("/refresh", ctrlWrapper(authControllers.refreshController));
router.get("/me", authenticate, ctrlWrapper(authControllers.getMeController));

export default router;
