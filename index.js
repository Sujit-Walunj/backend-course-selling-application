const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const {userRouter} = require("./Routes/user");
const {adminRouter} = require("./Routes/admin");

const app = express();

async function dbConnect(){
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
 }

 dbConnect();
 console.log("---------------------------------------------------");

 app.use(express.json());
 
 app.use("/user",userRouter);
 app.use("/admin",adminRouter);
 
 app.listen(3000);


