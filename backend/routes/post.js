// Import express module for being able to use express Router
const express = require('express');
// Call Router
const router = express.Router();

// Import the controller to associate the functions to the different routes
const postCtrl = require('../controllers/post');

// Add middleware
// For authentification (secure the roads)
const auth = require('../middleware/auth');
// For image management
const multer = require('../middleware/multer-config');

// Posts
router.get('/',auth, postCtrl.getAllPosts);
router.get('/:id',auth, postCtrl.getOnePost);
router.post('/',auth, multer, postCtrl.createOnePost);
router.put('/:id',auth, multer, postCtrl.modifyOnePost);
router.delete('/:id',auth, multer, postCtrl.deleteOnePost);

// Comments
router.post('/:id/comments',auth, multer, postCtrl.createOneComment);
router.put('/comments/:id',auth, multer, postCtrl.modifyOneComment);
router.delete('/comments/:id',auth, multer, postCtrl.deleteOneComment);

module.exports = router;