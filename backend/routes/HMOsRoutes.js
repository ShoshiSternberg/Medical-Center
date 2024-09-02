const express = require('express');
const router = express.Router();
const HMOController = require('../controllers/HMOsController');

// Get a single HMO by ID
router.get('/:id', HMOController.findHMOById);

// Get all HMOs
router.get('/', HMOController.findAllHMOs);

// Create a new HMO
router.post('/', HMOController.createHMO);

// Update an HMO by ID
router.put('/:id', HMOController.updateHMO);

// Delete an HMO by ID
router.delete('/:id', HMOController.deleteHMO);

module.exports = router;
