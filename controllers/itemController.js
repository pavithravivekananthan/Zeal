const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator');

const Item = require('../model/item');
const Seller = require('../model/seller');
const Account = require('../model/account');

exports.createItem = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed, Incorrect data entered.');
      error.errors = errors.array();
      return res.status(401).send(error);
    }
    if (!req.file) {
      const error = new Error('Upload an image as well.');
      return res.status(422).send(error);
    }

    const { title, price, tags, description } = req.body;

    const account = await Account.findById(req.loggedInUserId);
    const seller = await Seller.findOne({ account: account._id });

    const item = new Item({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
      tags: tags,
      creator: creator._id,
    });

    const savedItem = await item.save();
    seller.items.push(savedItem);
    const updatedSeller = await seller.save();
    if (updatedSeller) {
      res.status(201).send({
        message: 'Item created!',
        item: item,
        creator: { _id: creator._id, name: creator.name },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      const error = new Error(
        'Could not find any Item with the given itemId'
      );
      res.status(404).send(error);
    }

    clearImage(item.imageUrl);

    await Item.findByIdAndRemove(itemId);
    const account = await Account.findById(req.loggedInUserId);
    const seller = await Seller.findOne({ account: account._id });
    seller.items.pull(itemId);
    await seller.save();

    res.status(200).send({
      message: 'Item deleted successfully.',
    });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);

  }
};

exports.editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed, Incorrect data entered.');
      error.errors = errors.array();
      return res.status(401).send(error);
    }

    let imageUrl = req.body.image;

    const { title, price, tags, description } = req.body;
    if (req.file) imageUrl = req.file.path;
    if (!imageUrl) {
      const error = new Error('Image was not found, try again.');
      res.status(404).send(error);
    }

    const fetchedItem = await Item.findById(itemId)
    if (!fetchedItem) {
      const error = new Error(
        'Could not find any Item with the given itemId'
      );
      res.status(404).send(error);
    }

    if (imageUrl !== fetchedItem.imageUrl) {
      clearImage(fetchedItem.imageUrl);
    }

    fetchedItem.title = title;
    fetchedItem.description = description;
    fetchedItem.price = price;
    fetchedItem.tags = tags;
    fetchedItem.imageUrl = imageUrl;

    const updatedItem = await fetchedItem.save();
    res.status(200).send({
      message: 'Item updated',
      item: updatedItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getItems = async (req, res) => {
  try {
    const account = await Account.findById(req.loggedInUserId)

    const seller = await Seller.findOne({ account: account._id });

    const items = await Item.find({ _id: { $in: seller.items } });

    res.send({ items });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

};

exports.getItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId)

    if (!item) {
      const error = new Error(
        'Could not find any Item with the given itemId'
      );
      res.status(404).send(error);
    }
    res.status(200).send({ message: 'Item fetched successfully', item });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const clearImage = (filepath) => {
  filepath = path.join(__dirname, '../', filepath);
  fs.unlink(filepath, (err) => {
    console.log(err);
  });
};
