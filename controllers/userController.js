const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Seller = require('../model/seller');
const Item = require('../model/item');
const User = require('../model/user');
const Account = require('../model/account');
const config = require('config');
const jwtToken = config.get('jwtSecret');

exports.getRestaurants = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .populate('account', 'isVerified')
      .sort({ createdAt: -1 })

    const sellersFinal = await sellers.filter((restaurant) => {
      return restaurant.account.isVerified === true;
    });

    res.status(200).send({
      restaurants: sellersFinal,
      totalItems: sellersFinal.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restId = req.params.restId;
    const restaurant = await Seller.findById(restId)
      .populate('items')

    res.status(200).send({ result: restaurant });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.postAddress = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed, Incorrect data entered.');
      error.errors = errors.array();
      return res.status(401).send(error);
    }

    const { phoneNo,
      street,
      locality,
      aptName,
      zip,
      lat,
      lng,
      formattedAddress } = req.body;

    const account = await Account.findById(req.loggedInUserId)
    const user = await User.findOne({ account: account._id });
    const result = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        address: {
          street: street,
          locality: locality,
          zip: zip,
          phoneNo: phoneNo,
          aptName: aptName,
          lat: lat,
          lng: lng,
        },
        formattedAddress: formattedAddress,
      },
      { new: true }
    );

    res.status(200).send({ item: result });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated');
      return res.status(401).send(error);
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, jwtToken);

    if (!decodedToken) {
      const error = new Error('Not authenticated');
      return res.status(401).send(error);
    }

    const accountId = decodedToken.accountId;


    const account = await Account.findById(accountId);

    if (!account) {
      const error = new Error('Not found error');
      return res.status(404).send(error);
    }


    const user = await User.findOne({ account: account._id }).populate({
      path: 'account',
      select: ['email', 'role'],
    });

    let result;
    if (user) {
      result = user;
    } else {
      result = await Seller.findOne({ account: account._id })
        .populate('items')
        .populate({ path: 'account', select: ['email', 'role'] });
    }


    res.status(200).send({ result });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }

  exports.postCart = async (req, res) => {
    try {
      const itemId = req.body.itemId;

      if (!itemId) {
        const error = new Error('ItemId not provided');
        return res.status(404).send(error);
      }
      const item = await Item.findById(itemId)
      const account = await Account.findById(req.loggedInUserId);
      const user = await User.findOne({ account: account._id });
      await user.addToCart(item);

      res.status(200).send({ message: 'Item successfully added to cart.' });

    } catch (error) {
      console.log(error);
      res.status(500).send(error);

    }
  };
};

exports.getRestaurantsByAddress = async (req, res) => {
  try {
    const lat1 = req.params.lat;
    const lon1 = req.params.lng;

    const sellers = Seller.find()
      .populate('account', 'isVerified')
      .sort({ createdAt: -1 })

    const sellersVerified = sellers.filter((restaurant) => {
      return restaurant.account.isVerified === true;
    });

    const sellersFinal = sellersVerified.reduce((result, seller) => {
      const lat2 = seller.address.lat;
      const lon2 = seller.address.lng;

      const R = 6371; // kms
      const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const d = R * c; // in km
      if (d < 10) result.push(seller);

      return result;
    }, []);

    const results = sellersFinal;


    res.status(200).send({
      restaurants: results,
      totalItems: results.length,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};
