import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import * as notesControllers from "../controllers/notesController.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(notesControllers.listNotesController));
router.post("/", ctrlWrapper(notesControllers.createNoteController));
router.get("/:noteId", ctrlWrapper(notesControllers.getNoteController));
router.patch("/:noteId", ctrlWrapper(notesControllers.updateNoteController));
router.delete("/:noteId", ctrlWrapper(notesControllers.deleteNoteController));

export default router;
