const express = require("express");
const Router = express.Router;


const userRouter = Router(); // this might be returning app

userRouter.post("/sign-up" ,async function(req,res){
    res.send("hitting signup endpoint");
})

userRouter.post("/login" ,async function(req,res){
    res.send("hitting login endpoint");
})

userRouter.post("/course" ,async function(req,res){
    res.send("hitting course endpoint");
})

userRouter.get("/course/purchase" ,async function(req,res){
    res.send("hitting /course/purchase endpoint");
})


module.exports = {
    userRouter: userRouter
}