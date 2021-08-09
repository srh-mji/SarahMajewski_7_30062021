// Import express module for being able to use express Router
const express = require('express');
// Call Router
const router = express.Router();

// Import the controller to associate the functions to the different routes
const userCtrl = require('../controllers/user');

// Add middleware
// For authentification (secure the roads)
const auth = require('../middleware/auth');

// For image management
const multer = require('../middleware/multer-config');

// Creation of the different routes of the API
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/account', auth, userCtrl.getAllUsers);
router.put('/account/:id', auth, multer, userCtrl.updateAccount);
router.get('/account/:id', auth, userCtrl.getAccount);
router.delete('/account/:id', auth, userCtrl.deleteAccount);

module.exports = router;