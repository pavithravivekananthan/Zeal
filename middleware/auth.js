const jwt = require('jsonwebtoken');
const config = require('config');
const jwtToken = config.get('jwtSecret');
const Account = require('../model/account');

const verifyToken = (req, res) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated');
      return res.status(401).send(error);
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    decodedToken = jwt.verify(token, jwtToken);

    if (!decodedToken) {
      const error = new Error('Not authenticated');
      return res.status(401).send(error);
    }

    return decodedToken.accountId;
  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.verifySeller = async (req, res, next) => {
  try {
    const accountId = verifyToken(req, res);
    const account = await Account.findById(accountId)

    if (!account) {
      const error = new Error('User not found');
      return res.status(401).send(error);
    }
    if (account.role !== 'SELLER') {
      const error = new Error('Forbidden Access');
      return res.status(403).send(error);
    }
    req.loggedInUserId = accountId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.verifyUser = async (req, res) => {
  try {
    const accountId = verifyToken(req, res);
    const account = await Account.findById(accountId)

    if (!account) {
      const error = new Error('User not found');
      return res.status(401).send(error);
    }
    if (account.role !== 'USER') {
      const error = new Error('Forbidden Access');
      return res.status(403).send(error);
    }
    req.loggedInUserId = accountId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};
