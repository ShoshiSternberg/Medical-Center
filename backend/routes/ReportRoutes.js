const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

// Get a single report by ID
router.get('/:id', ReportController.findReportById);

// Get all reports
router.get('/', ReportController.findAllReports);

// Create a new report
router.post('/', ReportController.createReport);

// Update a report by ID
router.put('/:id', ReportController.updateReport);

// Delete a report by ID
router.delete('/:id', ReportController.deleteReport);

router.post('/generate/getGenerateReport', ReportController.generateDailyReport);
router.get('/generate/today', ReportController.getTodayReports);

module.exports = router;
