// Get bcrypt for hash password
const bcrypt = require('bcrypt');
// GetemailValidator for email check
const emailValidator = require("email-validator");
// Get passwordValidator for password check
const passwordValidator = require("password-validator");

// Get user model
const {
  User
} = require("../models")

// Get jsonwebtoken for assign a token to a user when they connect
const jwt = require('jsonwebtoken');

// Get file system for image downloads and modifications
const fs = require('fs');

// Create passwordSchema for more secure password
const passwordSchema = new passwordValidator();
// Password constraints
passwordSchema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()
  .is().not().oneOf(['Passw0rd', 'Password123']);


// Middleware that create a new user
exports.signup = (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      error: "Les champs doivent être remplis"
    });
  }
  if (emailValidator.validate(req.body.email)) {
    if (passwordSchema.validate(req.body.password)) {
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
          };
          User.create(user)
            .then(user => {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({
                    userId: user._id
                  },
                  'RANDOM_TOKEN_SECRET', {
                    expiresIn: '24h'
                  }
                )
              });
            })
            .catch(error => res.status(400).json({
              error
            }));
        })
        .catch(error => res.status(500).json({
          error
        }));
    } else {
      res.status(401).json({
        error: "Mot de passe requis : 8 caractères minimun, 1 Majuscule, 1 minuscule, sans espaces."
      });
    }
  } else {
    res.status(401).json({
      error: "Vérifier que votre email est valide"
    });
  }
};
// Middleware for user login 

exports.login = (req, res, next) => {
  // check if field password is empty
  if (!req.body.password) {
    return res.status(400).json({
      error: "Les champs doivent être remplis"
    });
  }
  // check if user email is in database
  if (passwordSchema.validate(req.body.password)) {
    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (user) {
          bcrypt.compare(req.body.password, user.password)
            .then(valid => {
              if (!valid) {
                res.status(401).json({
                  error: "Mot de passe incorrect !"
                });
              } else {
                res.status(200).json({
                  userId: user._id,
                  token: jwt.sign({
                      userId: user._id
                    },
                    'RANDOM_TOKEN_SECRET', {
                      expiresIn: '24h'
                    }
                  )
                });
              }
            })
            .catch(error => res.status(500).json({
              error
            }));
        } else {
          res.status(401).json({
            error: "Connexion refusée"
          });
        }
      })
      .catch(error => res.status(500).json({
        error
      }))
  } else {
    res.status(401).json({
      error: "Mot de passe incorrect !"
    });
  }
};

// Middleware to get user profil 
exports.getProfil = (req, res, next) => {
  const user = User.findOne({
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