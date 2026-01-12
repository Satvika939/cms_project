const express = require('express');
const router = express.Router();

const catalogController = require('../controllers/catalogController');

// Public catalog APIs (NO RBAC)
router.get('/programs', catalogController.getPublishedPrograms);
router.get('/programs/:programId', catalogController.getProgramDetail);

module.exports = router;
