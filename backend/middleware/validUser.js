// GetemailValidator for email check
const emailValidator = require("email-validator");
// Get passwordValidator for password check
const passwordValidator = require("password-validator");

// Middleware that checks if email & password are valid
exports.valid = (req, res, next) => {
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

if (
    !emailValidator.validate(req.body.email) ||
    !passwordSchema.validate(req.body.password)
  ) {
    res.writeHead(400, '{"message":"Mot de passe requis : 8 caractères minimun, 1 Majuscule, 1 minuscule, sans espaces. Email: vérifier que votre email est valide."}', {
        'content-type': 'application/json'
    });
    res.end('Mot de passe et/ou email incorrect');
  } else {
    next();
  }
  
};
