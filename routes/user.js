const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

/* End point to get restaurants */
router.get('/restaurants', userController.getRestaurants);

/* End point to get restaurant */
router.get('/restaurant/:restId', userController.getRestaurant);

/* End point to user address */
router.post(
  '/user/address',
  auth.verifyUser,
  [
    body('phoneNo', 'Enter a valid 10 digit phone number')
      .trim()
      .isLength({ min: 10, max: 10 }),
    body('street', 'Street cannot be empty').trim().not().isEmpty(),
    body('locality', 'Locality cannot be empty').trim().not().isEmpty(),
    body('aptName', 'Apartment name cannot be empty').trim().not().isEmpty(),
    body('zip', 'Zipcode cannot be empty').trim().not().isEmpty(),
  ],
  userController.postAddress
);

/* End point to get loggedIn user */
router.get('/user', userController.getLoggedInUser);

/* End point to restaurants by location*/
router.get(
  '/restaurants-location/:lat/:lng',
  userController.getRestaurantsByAddress
);

module.exports = router;
