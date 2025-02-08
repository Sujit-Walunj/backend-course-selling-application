const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {z} = require("zod");


// Router
const {userRouter} = require("./Routes/user");
const {adminRouter} = require("./Routes/admin");

const app = express();
const JWT_SECRETE = "Sujit1589";

// async function dbConnect(){
//     // await mongoose.connect("");
//  }

//  dbConnect();

 app.use(express.json());
 
 app.use("/user",userRouter);
 app.use("/admin",adminRouter);
 


 app.listen(3000);


