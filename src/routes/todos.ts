import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import * as todosControllers from "../controllers/todosController.js";

const router = Router();

router.get("/", ctrlWrapper(todosControllers.listTodosController));
router.post("/", ctrlWrapper(todosControllers.createTodoController));
router.get("/:todoId", ctrlWrapper(todosControllers.getTodoController));
router.patch("/:todoId", ctrlWrapper(todosControllers.updateTodoController));
router.delete("/:todoId", ctrlWrapper(todosControllers.deleteTodoController));

export default router;
