/*User Management controller for Registration And Login*/
const express = require('express'),
    router = express.Router(),
    productModel = require("../../models/Product/index"),
    CartModel = require("../../models/Item/index");
const {body, check, validationResult} = require('express-validator');
router.post('/addItem', [
        check('data.email', 'email is required').not().isEmpty(),
        check('data.email', 'Please provide valid Email id').isEmail(),
        check('data.product_id', 'Product Id is required').not().isEmpty(),
        check('data.price', 'price is required').not().isEmpty(),
        check('data.qty', 'Quantity should be number only').isNumeric(),
        check('data.qty', 'price is required').not().isEmpty(),
    ]
    , function (req, res) {

        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({errors: result.array()});
        }
        const {email, product_id, price} = req.body.data;
        const qty = Number.parseInt(req.body.data.qty);
        CartModel.findOne({email: email})
            .then(cart => {
                if (cart) {
                    // find same product available in cart or not
                    const indexFound = cart.items.findIndex(item => {
                        return item.product_id === product_id;
                    });
                    // check item found and qty is more than 0
                    if (indexFound !== -1 && qty <= 0) {
                        cart.items.splice(indexFound, 1);
                    } else if (indexFound !== -1) {
                        // check item found if found then add qty
                        cart.items[indexFound].qty = Number(cart.items[indexFound].qty) + Number(qty);
                    } else if (qty > 0) {
                        // item not found and qty is greater than 0 then push that item in cart
                        cart.items.push({
                            product_id: product_id,
                            qty: qty,
                            UnitPrice: price
                        });
                    } else {
                        // item not found
                        res.status(500).json({code: 1, message: "Internal Error."}).end();
                    }
                    cart.save().then(data => {
                        res.status(200).json({code: 0, message: "Item Successfully added in cart"}).end();
                    })
                } else {
                    const cartData = {
                        email: email,
                        items: [
                            {
                                product_id: product_id,
                                qty: qty,
                                UnitPrice: price
                            }
                        ]
                    };
                    cart = new CartModel(cartData);
                    cart.save().then(data => {
                        res.status(200).json({code: 0, message: "Item Successfully added in cart"}).end();
                    })

                }
            })
            .then(savedCart => {
                res.status(200).json({code: 0, message: "Item Successfully added in cart"}).end();
            })
            .catch(err => {
                res.status(500).json({code: 1, message: "Internal Error."}).end();
            });
    });

router.post('/updateCart', [check('data.email', 'email is required').not().isEmpty(),
    check('data.email', 'Please provide valid Email id').isEmail(),
    check('data.product_id', 'Product Id is required').not().isEmpty(),
    check('data.price', 'price is required').not().isEmpty(),
    check('data.qty', 'Quantity should be number only').isNumeric(),
    check('data.qty', 'price is required').not().isEmpty()], function (req, res) {
    try{
        const result = validationResult(req);
        
        if (!result.isEmpty()) {
            return res.status(400).json({errors: result.array()});
        }
        const {email, product_id} = req.body.data;
        const qty = Number.parseInt(req.body.data.qty);
        CartModel.findOne({email: email})
            .then(cart => {

                const indexFound = cart.items.findIndex(item => {
                    return item.product_id === product_id;
                });
                if (indexFound !== -1) {
                    let updatedQty = cart.items[indexFound].qty - qty;
                    if (updatedQty <= 0) {
                        cart.items.splice(indexFound, 1);
                    } else {
                        cart.items[indexFound].qty = updatedQty;
                    }
                    cart.save();
                    res.status(200).json({code: 0, message: "Item Successfully updated in cart"}).end();
                } else {
                    res.status(200).json({code: 0, message: "Could not found this Item in your Cart"}).end();
                }

            })
            .then(updatedCart => res.status(200).json({code: 0, message: "Item Successfully updated in cart"}).end())
            .catch(err => {
                res.status(500).json({code: 1, message: "Internal Error."}).end();

            });
    }catch (e) {
        res.status(500).json({code: 1, message: "Internal Error."}).end();
    }

});

router.post('/getCart', function (req, res) {
    try {
        let whereCondition = {};
        request = req.body;
        if (typeof request.data.email != 'undefined') {
            whereCondition.email = request.data.email
        }
        CartModel.find(whereCondition).then(data => {
            data[0] = data[0].toObject();
            if (data.length > 0 && data[0].items.length > 0) {
                data[0].items.forEach((item, index) => {
                    productModel.findOne({ProductID: item.product_id}).then(productdata => {
                        data[0].items[index].products = productdata
                    })
                    if (index === data[0].items.length) {
                        res.status(200).json({code: 0, data: data, message: "Success."}).end();
                    }
                })
            } else {
                res.status(200).json({code: 0, message: "No any item found in your cart."}).end();
            }
        }).catch(err => {
            res.status(500).json({code: 1, message: "Internal Error."}).end();
        })
    } catch (e) {
        res.status(500).json({code: 1, message: "Internal Error."}).end();
    }
});

module.exports = router;