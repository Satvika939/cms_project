const express = require('express');
const router = express.Router({ mergeParams: true });

const requireRole = require('../middlewares/requireRole');
const lessonController = require('../controllers/lessonController');

router.get(
  '/',
  requireRole('admin', 'editor', 'viewer'),
  lessonController.getLessonsByTerm
);

router.post(
  '/',
  requireRole('admin', 'editor'),
  lessonController.createLesson
);

router.get(
  "/:lessonId",
  requireRole("admin", "editor", "viewer"),
  lessonController.getLessonById
);

router.post(
  '/:lessonId/publish',
  requireRole('admin', 'editor'),
  lessonController.publishLesson
);

router.post(
  '/:lessonId/schedule',
  requireRole('admin', 'editor'),
  lessonController.scheduleLesson
);

// got argument handler is not a function error when i typed archive instead
// of archievelesson
router.post(
  '/:lessonId/archive',
  requireRole('admin', 'editor'),
  lessonController.archiveLesson
);

router.put(
  "/:lessonId",
  requireRole("admin", "editor"),
  lessonController.updateLesson
);


module.exports = router;
