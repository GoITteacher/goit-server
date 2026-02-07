import { Router } from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import * as catalogNewsController from "../controllers/public/catalogNewsController.js";
import * as songController from "../controllers/public/songController.js";
import * as carController from "../controllers/public/carController.js";
import * as movieController from "../controllers/public/movieController.js";
import * as studentController from "../controllers/public/studentController.js";
import * as lessonController from "../controllers/public/lessonController.js";

const router = Router();

router
  .route("/news")
  .get(ctrlWrapper(catalogNewsController.listCatalogNews))
  .post(ctrlWrapper(catalogNewsController.createCatalogNews));

router
  .route("/news/:newsId")
  .get(ctrlWrapper(catalogNewsController.getCatalogNewsById))
  .put(ctrlWrapper(catalogNewsController.updateCatalogNews))
  .delete(ctrlWrapper(catalogNewsController.deleteCatalogNews));

router
  .route("/songs")
  .get(ctrlWrapper(songController.listSongs))
  .post(ctrlWrapper(songController.createSong));

router
  .route("/songs/:songId")
  .get(ctrlWrapper(songController.getSongById))
  .put(ctrlWrapper(songController.updateSong))
  .delete(ctrlWrapper(songController.deleteSong));

router
  .route("/cars")
  .get(ctrlWrapper(carController.listCars))
  .post(ctrlWrapper(carController.createCar));

router
  .route("/cars/:carId")
  .get(ctrlWrapper(carController.getCarById))
  .put(ctrlWrapper(carController.updateCar))
  .delete(ctrlWrapper(carController.deleteCar));

router
  .route("/movies")
  .get(ctrlWrapper(movieController.listMovies))
  .post(ctrlWrapper(movieController.createMovie));

router
  .route("/movies/:movieId")
  .get(ctrlWrapper(movieController.getMovieById))
  .put(ctrlWrapper(movieController.updateMovie))
  .delete(ctrlWrapper(movieController.deleteMovie));

router
  .route("/students")
  .get(ctrlWrapper(studentController.listStudents))
  .post(ctrlWrapper(studentController.createStudent));

router
  .route("/students/:studentId")
  .get(ctrlWrapper(studentController.getStudentById))
  .put(ctrlWrapper(studentController.updateStudent))
  .delete(ctrlWrapper(studentController.deleteStudent));

router
  .route("/lessons")
  .get(ctrlWrapper(lessonController.listLessons))
  .post(ctrlWrapper(lessonController.createLesson));

router
  .route("/lessons/:lessonId")
  .get(ctrlWrapper(lessonController.getLessonById))
  .put(ctrlWrapper(lessonController.updateLesson))
  .delete(ctrlWrapper(lessonController.deleteLesson));

export default router;
