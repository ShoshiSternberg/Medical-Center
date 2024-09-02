const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UserController');

// Get a single user by ID
router.get('/id/:id', UsersController.findUserById);

// Get a single user by EmailAddress
router.get('/email/:emailAddress', UsersController.findUserByEmailAddress);

// Get all users
router.get('/', UsersController.findAllUsers);

// Create a new user
router.post('/', UsersController.createUser);

// User login
router.post('/login', UsersController.userLogin);

// Update a user by ID
router.put('/:id', UsersController.updateUser);

// Delete a user by ID
router.delete('/:id', UsersController.deleteUser);

module.exports = router;
