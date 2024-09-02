const express = require('express');
const router = express.Router();

const RolesController = require('../controllers/RolesController');

// Get a single role by ID
router.get('/:id', RolesController.findRoleById);

// Get all roles
router.get('/', RolesController.findAllRoles);

// Create a new role
router.post('/', RolesController.createRole);

// Update a role by ID
router.put('/:id', RolesController.updateRole);

// Delete a role by ID
router.delete('/:id', RolesController.deleteRole);

module.exports = router;
