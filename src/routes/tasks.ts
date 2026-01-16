import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import * as tasksControllers from "../controllers/tasksController.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(tasksControllers.listTasksController));
router.post("/", ctrlWrapper(tasksControllers.createTaskController));
router.get("/:taskId", ctrlWrapper(tasksControllers.getTaskController));
router.patch("/:taskId", ctrlWrapper(tasksControllers.updateTaskController));
router.delete("/:taskId", ctrlWrapper(tasksControllers.deleteTaskController));

export default router;
