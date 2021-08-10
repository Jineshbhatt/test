/*User Management controller for Registration And Login*/
const express = require('express'),
    router = express.Router(),
    common = require("../../config/common"),
    ProductModel = require('../../models/Product/index'),
    randomstring = require('randomstring'),
    fs = require('fs'),
    mkdirp = require("mkdirp");
const { body, validationResult } = require('express-validator');

router.get('/getAllProduct', function (req, res) {
    try {
        let whereCondition = {};
        request = req.query;
        if (typeof request.ProductID != 'undefined') {
            whereCondition.ProductID = Number(request.ProductID)
        }
        if (typeof request.ProductCode != 'undefined') {
            whereCondition.ProductCode = request.ProductCode
        }
        if (typeof request.ProductName != 'undefined') {
            whereCondition.ProductName = request.ProductName
        }
        if (typeof request.status != 'undefined') {
            whereCondition.Status = request.status.toString()
        }
        ProductModel.find(whereCondition).then(data => {
            if (data.length > 0) {
                res.status(200).json({code: 0, data: data, message: "Product fetched successfully."}).end();
            } else {
                res.status(200).json({code: 0, message: "Data Not found."}).end();
            }
        }).catch(err => {
            res.status(500).json({code: 1, message: "Internal Error."}).end();
        })
    } catch (e) {
        res.status(500).json({code: 1, message: "Internal Error."}).end();
    }
});

router.post('/addProduct',
    body('data.productName')
        .exists()
        .isLength({ min: 3,max:25 })
        .withMessage('Please Enter valid Product Name'),
    body('data.imagePath')
        .exists()
        .withMessage("Please enter valid Image path"),
    body('data.description')
        .isLength({ min: 5,max:25 })
        .exists()
        .withMessage("Please enter valid description"),
    body('data.quantity')
        .exists()
        .withMessage("Please enter valid quantity"),
    body('data.unitPrice')
        .exists()
        .withMessage("Please enter valid quantity"),
    function (req, res) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        let request = req.body;
        let ProductID = randomstring.generate({
            length: 5,
            charset: 'numeric'
        })
        let ProductCode = randomstring.generate({
            length: 5,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        })
        let insertData = {
            ProductID: ProductID,
            ProductCode: ProductCode,
            ProductName: request.data.productName,
            ProductImage: request.data.imagePath,
            Description: request.data.description,
            Quantity: Number(request.data.quantity),
            UnitPrice: request.data.unitPrice
        }

        if (typeof request.data.status != 'undefined') {
            insertData.status = Number(request.data.status)
        }
        let ProductRequest = new ProductModel(insertData);
        ProductRequest.save().then(data => {
            res.status(200).json({code: 0, message: "Product Saved successfully."}).end();
        }).catch(err => {
            res.status(500).json({code: 1, message: "Internal Error."}).end();
        })
    } catch (e) {
        res.status(500).json({code: 1, message: "Internal Error."}).end();
    }
})
// file validation not applied
// file size validatioin not applied
router.post('/uploadProductImage',  function (req, res) {
    try{
        const fileContents = Buffer.from(req.files.file.data, 'base64');
        let imageName = randomstring.generate({
            length: 5,
            charset: 'alphanumeric'
        })
        LogDir =  common.projectRoot +'uploads/product';
        imageFile = common.projectRoot +'uploads/product/'+imageName+"."+req.files.file.mimetype.split('/')[1];
        if (!fs.existsSync(LogDir)) {
            mkdirp(LogDir, function (err, result) {
                if (err) {
                    res.status(500).json({code: 1, message: "Internal Error."}).end();
                } else if (result) {

                    fs.writeFile(imageFile, fileContents, (err) => {
                        if (err) {
                            res.status(500).json({code: 1, message: "Internal Error."}).end();
                        }else{
                            res.status(200).json({code: 0, message: "Product Image upload successfully.",path:imageFile}).end();
                        }
                    })
                }
            });
        } else {
            fs.writeFile(imageFile, fileContents, (err) => {
                if (err) {
                    res.status(500).json({code: 1, message: "Internal Error."}).end();
                }else{
                    res.status(200).json({code: 0, message: "Product Image upload successfully.",path:imageFile}).end();
                }
            })
        }
    }catch (e) {
        res.status(500).json({code: 1, message: "Internal Error."}).end();
    }


})
// download fille using file name
router.get('/download/:file(*)',(req, res) => {
    var file = req.params.file;

    LogDir =  common.projectRoot +'uploads/product';
    imageFile = common.projectRoot +'uploads/product/'+file;
    if (!fs.existsSync(LogDir)) {
        mkdirp(LogDir, function (err, result) {
            if (err) {
                res.status(500).json({code: 1, message: "Internal Error."}).end();
            } else if (result) {

                var bitmap = fs.readFileSync(imageFile);
                res.status(200).json({data:new Buffer(bitmap).toString('base64')});
            }
        });
    } else {
        var bitmap = fs.readFileSync(imageFile);
        res.status(200).json({data:new Buffer(bitmap).toString('base64')});
    }

});

module.exports = router;