import { Router } from "express";
import * as newsControllers from "../controllers/newsController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.post("/", ctrlWrapper(newsControllers.createNewsController));
router.get("/", ctrlWrapper(newsControllers.getAllNewsController));
router.delete("/:newsId", ctrlWrapper(newsControllers.deleteNewsController));

export default router;
