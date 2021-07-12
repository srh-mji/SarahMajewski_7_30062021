// Import express module for being able to use express Router
const express = require('express');
// Call Router
const router = express.Router();

// Import the controller to associate the functions to the different routes
const userCtrl = require('../controllers/user');

// Add middleware
// For password and email verification
const validUser = require('../middleware/validUser');

// For authentification (secure the roads)
const auth = require('../middleware/auth');

// For image management
const multer = require('../middleware/multer-config');

// Creation of the different routes of the API
router.post('/signup', validUser.valid, userCtrl.signup);
router.post('/login', validUser.valid, userCtrl.login);
router.get('/profil', auth, userCtrl.getAllUsers);
router.put('/profil/:id', auth, multer, userCtrl.updateProfil);
router.get('/profil/.id', auth, userCtrl.getProfil);
router.delete('/profil/:id', auth, userCtrl.deleteProfil);

module.exports = router;