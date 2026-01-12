const express = require('express');
const router = express.Router({ mergeParams: true });

const requireRole = require('../middlewares/requireRole');
const termController = require('../controllers/termController');
const lessonRoutes = require('./lessonRoutes');

router.get(
  '/',
  requireRole('admin', 'editor', 'viewer'),
  termController.getTermsByProgram
);

router.post(
  '/',
  requireRole('admin', 'editor'),
  termController.createTerm
);

router.get(
  '/:termId',
  requireRole('admin', 'editor', 'viewer'),
  termController.getTermById
);

router.put(
  "/:termId",
  requireRole("admin", "editor"),
  termController.updateTerm
);

router.use('/:termId/lessons', lessonRoutes);

module.exports = router;
