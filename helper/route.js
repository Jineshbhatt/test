module.exports = function(app){
    app.use('/api/product',require('../controller/product/index')),
    app.use('/api/cart',require('../controller/cart/index'))
};