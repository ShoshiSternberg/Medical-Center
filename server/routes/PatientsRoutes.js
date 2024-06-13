const express = require('express');
const router = express.Router();

const PatientsController = require('../controllers/PatientsController');

// Get a single patient by ID
router.get('/:id', PatientsController.findPatientById);

// Get all patients
router.get('/', PatientsController.findAllPatients);

// Create a new patient
router.post('/', PatientsController.createPatient);

// Update a patient by ID
router.put('/:id', PatientsController.updatePatient);

// Delete a patient by ID
router.delete('/:id', PatientsController.deletePatient);

module.exports = router;
