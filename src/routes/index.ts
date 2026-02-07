import { Router } from "express";
import authRouter from "./auth.js";
import newsRouter from "./news.js";
import tasksRouter from "./tasks.js";
import notesRouter from "./notes.js";
import todosRouter from "./todos.js";
import publicRouter from "./public.js";
import docsRouter from "./docs.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/news", newsRouter);
router.use("/tasks", tasksRouter);
router.use("/notes", notesRouter);
router.use("/todos", todosRouter);
router.use("/public", publicRouter);
router.use("/docs", docsRouter);

export default router;
