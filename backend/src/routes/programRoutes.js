// follows a hierarchial routing system
const express = require('express');
const router = express.Router();
const requireRole = require('../middlewares/requireRole');

const programController = require('../controllers/programController');
const termRoutes = require('./termRoutes');

router.get('/', requireRole('admin','editor','viewer'), programController.getPrograms);
router.post('/', requireRole('admin','editor'), programController.createProgram);
router.put('/:id', requireRole('admin','editor'), programController.updateProgram);
router.get(
  '/:id',
  requireRole('admin','editor','viewer'),
  programController.getProgramById
);

// 👇 nested routes
router.use('/:programId/terms', termRoutes);

module.exports = router;
