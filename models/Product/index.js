const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let  Int32 = require('mongoose-int32').loadType(mongoose);
const ProductSchema = new Schema({
    ProductID: {type: Int32},
    ProductCode: {type: String},
    ProductName: {type: String},
    ProductImage: {type: String},
    Description: { type: String, default: ''},
    Quantity: {type: Int32},
    UnitPrice: {type: String},
    Status: {type: String, default: '1'},
}, { versionKey: false });

module.exports = mongoose.model('products', ProductSchema);