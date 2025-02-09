const express = require("express");
const mongoose = require("mongoose");

// Router
const {userRouter} = require("./Routes/user");
const {adminRouter} = require("./Routes/admin");

const app = express();

const {userAuth} = require("./Middlewares/user");
const {adminAuth} = require("./Middlewares/admin");

const JWT_SECRETE = "Sujit1589";

async function dbConnect(){
    await mongoose.connect("mongodb+srv://sujitwalunj1589:Walunj%401589@cohort.7mlez.mongodb.net/Coursera");
 }

 dbConnect();
 console.log("Connected to database");
 console.log("----------------------------------------------------------------------------------");
 app.use(express.json());







 
 app.use("/user",userRouter);
 app.use("/admin",adminRouter);
 


 app.listen(3000);


