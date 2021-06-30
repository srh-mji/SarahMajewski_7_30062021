// Import express module
const express = require('express');

// Access to the path of our file system
const path = require('path');

// // Routes declaration
// const userRoutes = require('./routes/user');
// const postRoutes = require('./routes/post');
// const commentRoutes = require('./routes/comment');

// Create express application
const app = express();


// Middleware Header which unblocks some CORS security systems error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// Transforms the data from the POST request into exploitable JSON object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Middleware which allows you to load the files in the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// // Middleware transmit requests to these urls to the corresponding routes
// app.use('/api/user', userRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/comment', commentRoutes);

// Export of the express application for declaration in server.js
module.exports = app;