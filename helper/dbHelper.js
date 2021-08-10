const commonConfig = require("../config/common"),
    mongoose = require("mongoose"),
    dateFormat = require("dateformat"),
    fs = require("fs");
let mongoDB = mongoose.connection,
    timeout = 100,
    limit = 10,
    counter = 0;

// Mongo Connection
function MongoDBConnection() {
    try{
        if (mongoose.connection.readyState === 0 && mongoose.connection.readyState !== 2 && mongoose.connection.readyState !== 1) {
            let mongoDBConnectionOption = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            }

            mongoose.connect(commonConfig.mongoURI, mongoDBConnectionOption)
        }
    }catch(e){
        console.log("Db Helper : ",e)
    }

}
mongoDB.on('connected', function(){
    console.log("Mongo Db connected")
    timeout = 100;
    counter = 0;

});
mongoDB.on('error', function (error) {
    console.log("Db Helper : ",error)
    let ErrorLogFile = commonConfig.ProjectRoot + 'logs/DBConnectionErrorlog_' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';
    let LogString = '===================== Database Connection Error ======================\n';
    LogString += 'DateTime : ' + new Date() + '\n\n\r';
    LogString += 'Exception : ' + error.toString() + '\n\n\r';
    fs.appendFile(ErrorLogFile, LogString, "utf8", function (err) {
        if (err) {
        }
    });
});
// handle disconnect event in mongodb
mongoDB.on('disconnected', function () {

    counter++;
    if(counter == 0){
        getIntervalTimeout(timeout);
    }else if(counter !== limit){
        timeout = timeout * 2;
        getIntervalTimeout(timeout);
    }else {
        let ErrorLogFile = commonConfig.ProjectRoot + 'logs/DBConnectionErrorlog_' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';
        let LogString = '===================== Reconnect Attempts Are Reached to Limit ======================\n';
        LogString += 'DateTime : ' + dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss:l TT") + '\n\n\r';
        fs.appendFile(ErrorLogFile, LogString, "utf8", function (err) {
            if (err) {
            }
        });
    }
});
exports.ConnectMongoDB = function () {
    MongoDBConnection();
};
function getIntervalTimeout(timeout){
    setTimeout(MongoDBConnection, timeout);
}

// Reload and Reset log cache
exports.reloadDBConnectionCache = function () {
    timeout = 100;
    limit = 10;
    counter = 0;
    MongoDBConnection();
}
