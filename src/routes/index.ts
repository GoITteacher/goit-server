import { Router } from "express";
import authRouter from "./auth.js";
import newsRouter from "./news.js";
import tasksRouter from "./tasks.js";
import notesRouter from "./notes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/news", newsRouter);
router.use("/tasks", tasksRouter);
router.use("/notes", notesRouter);

export default router;
