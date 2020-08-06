const { body} = require('express-validator');

const validate = [
    body('name').not().isEmpty().isLength({min:3, max:20}),
    body('email').isEmail().isLength({min:5, max:255}),
    body('password').isLength({min:5}),
    body('repassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
    })
]



module.exports.validateSignin = validate;
