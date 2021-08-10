const express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    dateFormat = require("dateformat"),
    fs = require('fs'),
    mongoose = require("mongoose"),
    fileUpload = require('express-fileupload'),
    cors = require('cors'),
    commonConfig = require('./config/common')
    mongoDBConnectionHelper = require("./helper/dbHelper");
// Connect Mongodb
mongoDBConnectionHelper.ConnectMongoDB();
const app = express();
// Enable cors module
app.use(cors());
// Enable Express json for getting json request
app.use(express.json());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

/*app.all("/!*", function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Requested-With,X-XSRF-TOKEN,X-Key,Authorization");
    res.header("Access-Control-Expose-Headers", "file-content-type,file-extention");

})*/
require("./helper/route")(app);

process.on('uncaughtException', function (err) {
    let ErrorLogFile = commonConfig.projectRoot + 'logs/UncaughtException' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';
    let LogString = '===================== Uncaught Exception Error ======================\n';
    LogString += 'DateTime : ' + new Date() + '\n\n\r';
    LogString += 'Exception : ' + err.toString() + '\n\n\r';
    fs.appendFile(ErrorLogFile, LogString, "utf8", function (err) {
        if (err) {
        }
    });
});
process.on('unhandledRejection', function (err) {
    let ErrorLogFile = commonConfig.projectRoot + 'logs/unhandledRejection' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';
    let LogString = '===================== Unhandled Rejection Warning ======================\n';
    LogString += 'DateTime : ' + new Date() + '\n\n\r';
    LogString += 'Exception : ' + err.toString() + '\n\n\r';
    fs.appendFile(ErrorLogFile, LogString, "utf8", function (err) {
        if (err) {
        }
    });
});


const port = commonConfig.port || 3000;
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const server = http.createServer(app).listen(port,'0.0.0.0', () => console.log(`Server running on port ${port}`));
//https.createServer(app).listen(port,'0.0.0.0', () => console.log(`Server running on port ${port}`));
//const server = app.listen(port, () => console.log(`Server running on port ${port}`));
server.timeout = commonConfig.serverTimeout; // 241000;