// Get bcrypt for hash password
const bcrypt = require('bcrypt');

// Get models
const db = require("../models")

// Get user model
const User = require('../models/user');

// Get jsonwebtoken for assign a token to a user when they connect
const jwt = require('jsonwebtoken');

// Get file system for image downloads and modifications
const fs = require('fs');

// Middleware that create a new user
exports.signup = (req, res, next) => {
  const {
    name,
    email,
    password
  } = req.body;
  if (user !== null) {
    if (user.email === req.body.email) {
      return res.status(400).json({
        error: "cet email est déjà utilisé"
      });
    }
  } else {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        user.save()
          .then(() => res.status(201).json({
            message: "Utilisateur créé !"
          }))
          .catch(error => res.status(401).json({
            error
          }))
      })
      .catch(error => res.status(500).json({
        error
      }))
  }
};

// Middleware for user login 
exports.login = (req, res, next) => {
  // check if user email is in database
  User.findOne({
    where: {
      email: req.body.email
    }
  });

  if (user === null) {
    return res.status(403).send({
      error: "Connexion échouée"
    });
  }
  // compare passwords
  bcrypt.compare(req.body.password, user.password)
    .then(valid => {
      if (!valid) {
        return res.status(401).json({
          error: 'Mot de passe incorrect !'
        })
      }
      // returns user and token
      res.status(200).json({
        message: "Connexion réussie",
        userId: user.id,
        token: jwt.sign({
            userId: user.id
          },
          'RANDOM_TOKEN_SECRET', {
            expiresIn: '24h'
          }
        )
      })
    })
    .catch(error => res.status(501).json({
      error
    }))
    .catch(error => res.status(502).json({
      error
    }));
};

// Middleware to get user profil 
exports.getProfil = (req, res, next) => {
  User.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => res.status(404).json({
      error: 'Utilisateur non trouvé'
    }));
};

// Middleware to get all users
exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.status(200).send(users)
    })
    .catch(error => res.status(400).json({
      error
    }));
};

// Middleware to update user profil
exports.updateProfil = (req, res, next) => {
  User.findOne({
    where: {
      id: id
    }
  });
  const name = req.body.name;
  const biography = req.body.biography;


  // checking fields
  if (name === null || name === '' || biography === null || biography === '') {
    return res.status(400).json({
      'error': "Les champs 'nom' et 'biographie' doivent être remplis"
    });
  }
  // add/change profil image 
  const userObject = req.file ? {
    ...req.body.user,
    image: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`
  } : {
    ...req.body
  };

  User.update({
      ...userObject,
      id: req.params.id
    }, {
      where: {
        id: req.params.id
      }
    })
    .then(() => res.status(200).json({
      message: 'Utilisateur modifié !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

// Middleware to delete user profil
exports.deleteProfil = (req, res, next) => {
  try {
    User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (user.image !== null) {
      const filename = user.image.split("/images")[1];
      fs.unlink(`upload/${filename}`, () => {
        // delete image and delete user
        User.destroy({
          where: {
            id: id
          }
        });
        res.status(200).json({
          message: 'Utilisateur supprimé'
        });
      });
    } else {
      // delete image
      User.destroy({
        where: {
          id: id
        }
      });
      res.status(200).json({
        message: 'Utilisateur supprimé'
      });
    }
  } catch (error) {
    return res.status(400).send({
      error
    });
  }
};