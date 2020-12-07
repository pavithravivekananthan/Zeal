const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Account = require('../model/account');
const Seller = require('../model/seller');
const config = require('config');
const jwtToken = config.get('jwtSecret');

exports.signupUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed, Incorrect data entered.');
      error.errors = errors.array();
      return res.status(401).send(error);
    }
    const { email, firstName, password, lastName, role } = req.body;

    if (role !== 'USER') {
      const error = new Error(
        'User should have a role of ROLE:USER'
      );

      return res.status(401).send(error);
    }

    const emailExists = await User.findOne({ email: email })
    if (emailExists) return res.status(401).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(32).toString('hex');
    const account = new Account({
      role: role,
      email: email,
      password: hashedPassword,
      accountVerifyToken: token,
      accountVerifyTokenExpiration: Date.now() + 3600000,
    });
    const savedAccount = await account.save();
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      account: savedAccount,
    });
    const savedUser = await user.save();

    res.status(200).send(savedUser);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.verifyAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const account = await Account.findOne({
      accountVerifyToken: token,
      accountVerifyTokenExpiration: { $gt: Date.now() },
    });

    if (!account) {
      const error = new Error(
        'Invalid Token'
      );
      return res.status(403).send(error);
    }

    account.isVerified = true;
    account.accountVerifyToken = undefined;
    account.accountVerifyTokenExpiration = undefined;
    await account.save();
    res.status(200).send({ message: 'Account verified successfully.' });

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const account = await Account.findOne({ email: email });
    if (!account) return res.status(401).send({ "message": 'Email or password is wrong' });

    const validPass = await bcrypt.compare(password, account.password);
    if (!validPass) return res.status(401).send({ "message": 'Email or password is wrong' });

    const token = jwt.sign({ accountId: account._id.toString() }, jwtToken, { expiresIn: '10h' });
    res.status(200).send({ message: 'Logged-in successfully', token: token });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);

  }
};

exports.signupSeller = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed, Incorrect data entered.');
      error.errors = errors.array();
      return res.status(401).send(error);
    }
    const { email, name, password, tags, role, payment, minOrderAmount,
      costForOne, phoneNo, street, aptName, formattedAddress,
      lat, lng, locality, zip } = req.body;

    if (role !== 'SELLER') {
      const error = new Error(
        'Seller should have a role of ROLE:SELLER'
      );
      return res.status(401).send(error);
    }

    const paymentArray = payment.split(' ');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(32).toString('hex');
    const account = new Account({
      role: role,
      email: email,
      password: hashedPassword,
      accountVerifyToken: token,
      accountVerifyTokenExpiration: Date.now() + 3600000,
    });
    const savedAccount = await account.save();
    const seller = new Seller({
      name: name,
      tags: tags,
      imageUrl: arrayFiles,
      minOrderAmount: minOrderAmount,
      costForOne: costForOne,
      account: savedAccount,
      payment: paymentArray,
      formattedAddress: formattedAddress,
      address: {
        street: street,
        zip: zip,
        phoneNo: phoneNo,
        locality: locality,
        aptName: aptName,
        lat: lat,
        lng: lng,
      },
    });
    const savedSeller = await seller.save();

    res.status(200).send({
      message:
        'Seller signed-up successfully, please log in.',
      sellerId: savedSeller._id,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};
