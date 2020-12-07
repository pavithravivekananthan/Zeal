const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryInfo = {
  street: String,
  locality: String,
  aptName: String,
  zip: String,
  phoneNo: Number,
  lat: Number,
  lng: Number,
};

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    formattedAddress: {
      type: String,
    },
    address: deliveryInfo,
    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    cart: {
      items: [
        {
          _id: false,
          itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);
