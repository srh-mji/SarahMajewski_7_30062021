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


// User signup
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
                userId: user.id,
                token: jwt.sign({
                    userId: user.id
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

// User login 
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
                  userId: user.id,
                  token: jwt.sign({
                      userId: user.id
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

// Get user Account 
exports.getAccount = (req, res, next) => {
  User.findOne({
      where: {
        id: req.params.id
      },
    })
    .then(console.log(req.params.id))
    .then(user => {
      res.status(200).send(user)
    })
    .catch(error => res.status(404).json({
      error: 'Utilisateur non trouvé'
    }));
};

// Get all Users
exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.status(200).send(users)
    })
    .catch(error => res.status(400).json({
      error
    }));
};

// Update user Account
exports.updateAccount = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;

  User.findOne({
      where: {
        id: req.params.id
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          'error': "user"
        });
      }

      const name = req.body.name;
      const biography = req.body.biography;

      // checking fields
      if (name === null || name === '' || biography === null || biography === '') {
        return res.status(400).json({
          'error': "Les champs 'nom' et 'biographie' doivent être remplis"
        });
      }

      if (userId == user.id) {
        if (req.file && user.image) {
          const filename = user.image.split("/images")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.log("failed to delete local image:" + err);
            } else {
              console.log('successfully deleted local image');
            }
          });
          const userObject = req.file ? {
            ...req.body,
            image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          } : {
            ...req.body,
            image: user.image
          }
          User.update({
              ...userObject,
              id: req.params.id
            }, {
              where: {
                id: req.params.id
              }
            })
            .then(() => res.status(200).json({
              message: "User modifié !"
            }))
            .catch(error => res.status(400).json({
              error
            }))
        } else {
          const userObject = req.file ? {
            ...req.body,
            image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          } : {
            ...req.body,
            image: user.image
          }
          User.update({
              ...userObject,
              id: req.params.id
            }, {
              where: {
                id: req.params.id
              }
            })
            .then(() => res.status(200).json({
              message: "User modifié !"
            }))
            .catch(error => res.status(400).json({
              error
            }))
        }
      }
    })
    .catch(error => res.status(400).json({
      error
    }))
};

// Delete user account
exports.deleteAccount = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;

  User.findOne({
      where: {
        id: req.params.id,
      }
    })
    .then((User) => {
      if (userId == User.id || userId == 1) {
        if (User.image) {
          const filename = User.image.split("/images")[1];
          fs.unlink(`images/${filename}`, () => {
            User.destroy({
                where: {
                  id: req.params.id
                }
              })
              .then(() => res.status(200).json({
                message: "Utilisateur supprimé !"
              }))
              .catch(error => res.status(400).json({
                error
              }))
          });
        } else {
          User.destroy({
              where: {
                id: req.params.id
              }
            })
            .then(() => res.status(200).json({
              message: "Utilisateur supprimé !"
            }))
            .catch(error => res.status(400).json({
              error
            }))
        }
      }
    })
    .catch(error => res.status(400).json({
      error
    }))
};