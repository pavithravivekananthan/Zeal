const express = require('express');
const { body } = require('express-validator');
const Account = require('../model/account');
const authController = require('../controllers/authController');
const router = express.Router();

/* End point to register user */
router.post(
  '/signup-user',
  [
    body('email', 'Please enter a valid email to continue.')
      .isEmail()
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              'Email address already exists, please try again with another email.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Password should be at least 6 characters long')
      .trim()
      .isLength({ min: 6 }),
    body('firstName', 'First Name cannot be empty').trim().not().isEmpty(),
    body('lastName', 'Last Name cannot be empty').trim().not().isEmpty(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
  ]

  , authController.signupUser
);

/* End point to verify token */
router.get('/verify/:token', authController.verifyAccount);

/* End point to login user */
router.post('/login', authController.login);

/* End point to register seller */
router.post(
  '/signup-seller',
  [
    body('email', 'Please enter a valid email to continue.')
      .isEmail()
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              'Email address already exists, please try again with another business email.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Password should be at least 6 characters long')
      .trim()
      .isLength({ min: 6 }),
    body('name', 'Restaurant Name cannot be empty').trim().not().isEmpty(),
    body('payment', 'Payment cannot be empty').trim().not().isEmpty(),
    body('tags', 'Tags cannot be empty').trim().not().isEmpty(),
    body('street', 'Street cannot be empty').trim().not().isEmpty(),
    body('locality', 'Locality cannot be empty').trim().not().isEmpty(),
    body('aptName', 'Apartment name cannot be empty').trim().not().isEmpty(),
    body('zip', 'Zipcode cannot be empty').trim().not().isEmpty(),
    body('costForOne', 'Cost for one cannot be empty').trim().not().isEmpty(),
    body('minOrderAmount', 'Minimum Order Amount cannot be empty')
      .trim()
      .not()
      .isEmpty(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
    body('phoneNo', 'Enter a valid 10 digit phone number')
      .trim()
      .isLength({ min: 10, max: 10 }),
  ],
  authController.signupSeller
);


module.exports = router;
