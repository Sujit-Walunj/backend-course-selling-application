const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const ObjectId = mongoose.ObjectId;


const userSchema = new Schema({
    email       : {type :String, unique : true},
    password    : String,
    firstname   : String,
    lastname    : String,
    course      : [ObjectId]
});


const adminSchema = new Schema({
    email       : {type : String , unique : true},
    password    : String,
    firstname   : String,
    lastname    : String
})


const courseSchema = new Schema({
    title       : String,
    description : String,
    price       : Number,
    imageUrl    : String,
    Creator     : ObjectId
})

const purchaseSchema = new Schema({
    user : ObjectId,
    course : ObjectId
})

// now create a model out of schema

const userModel     = mongoose.model("user",userSchema);
const adminModel    = mongoose.model("admin",adminSchema);
const courseModel   = mongoose.model("courses",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);


module.exports = {
    userModel       : userModel,
    adminModel      : adminModel,
    courseModel     : courseModel,
    purchaseModel   : purchaseModel
}