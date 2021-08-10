const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
    product_id: {
        type: String,
        required: true
    },
    qty: {
        type: String,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    UnitPrice: {type: String},
});
const CartSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    items: [ItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('cart', CartSchema);