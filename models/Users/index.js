const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Create Schema*/
const UserSchema = new Schema({
    userID:{type:String,required:true},
    firstname : {type: String,default:""},
    lastname : {type: String,default:""},
    middlename : {type: String,default:""},
    email : {type: String,required: true},
    mobile : {type: String,required: true},
    dob: {type: Date,required: true},
    gender: {type: String,required: true},
    addressLine1: {type: String,default:""},
    addressLine2: {type: String,default:""},
    countryCode: {type: String,default:""},
    password : {type: String,required: true},
    securityQuestions: [],
    agreeterms: {type: Boolean},
    referral : {type: String},
    secret2FA : {type: String,default:""},
    status2FA : {type: Number,default:0},
    userType : {type: Number,default:3},
    isActive : {type: Number,default:1},
    dateCreated : { type: Date, default: Date.now },
    dateModified : { type: Date, default: Date.now },
},{versionKey:false});
delete mongoose.models['users'];
delete mongoose.modelSchemas[UserSchema];
module.exports = mongoose.model('users', UserSchema);
