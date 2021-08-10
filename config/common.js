module.exports = {
    projectRoot : __dirname.substring(0, __dirname.indexOf("\\routes") + '\logs'),
    serverTimeout:241000,
    mongoURI:"mongodb://ProductDB:ProductDB@127.0.0.1:27017/productdb",
    port:3000
}
