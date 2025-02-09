const express = require("express");
const {z} = require("zod");
const Router = express.Router;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userModel,courseModel} = require("../Database/dbSchema");
const { authUser } = require("../Middlewares/user");

const userRouter = Router(); // this might be returning app


userRouter.post("/sign-up" ,async function(req,res){
    // input validation

        // define schema
        const requiredData = z.object({
            email : z.string().email(),
            password : z.string().min(6).max(10),
            firstname : z.string().min(3).max(15),
            lastname : z.string().min(3).max(15),
        })

        const data = requiredData.safeParse(req.body);
        if(!data.success){
            res.status(400).json({
                error : data.error
            });
            return;
        }
        
        
        const {email,password,firstname,lastname} = req.body;
             

        const hashedPassword  = await bcrypt.hash(password,10);
        try {
            await userModel.create({
                email       : email,
                password    : hashedPassword,
                firstname   : firstname,
                lastname    : lastname
            })
        }
        catch(e){
            console.log("Error in creating database entry for new user");
            console.log(e);
            res.status(500).json({
                msg : "Internal Server Error"
            })
            return;
        }
        res.status(200).json({
            msg : "Your account created successfully"
        })
})

userRouter.post("/login" ,async function(req,res){

    // input validation
    const requiredData = z.object({
        email : z.string().email(),
        password : z.string().min(6).max(10)
    })

    const data = requiredData.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            error : data.error
        });
        return;
    }

 
    const{ email} = req.body;
    const user = await userModel.findOne({email : email});

    if(!user){
        res.status(404).json({
            msg : "User not found"
        })
        return;
    }

    const password = req.body.password;
    const isUser = bcrypt.compare(password,user.password);

    if(isUser){
        const token = jwt.sign(
            {
                userId : user._id,
                role : "user" },
                process.env.JWT_SECRETE_USER
                    )
        res.status(200).json({
            msg : "You are logged in successfully",
            token : token
        })
        return ;
    }
    else{

        res.status(400).json({
            msg : "Password is incorrect"
        })
        return;

    }  
})

userRouter.get("/course",authUser,async function(req,res){
    
   let data = null;
    try{
         data = await courseModel.find({});
    }
    catch(e){
        console.log(e);
        res.json({
            msg:"Internal Server Error"
        })
        return;
    }

    res.status(200).json({
        msg: "Successfully fatched all Courses",
        courses : data 
    })
    return;
})

userRouter.get("/course/purchase",authUser ,async function(req,res){
    res.send("hitting /course/purchase endpoint");

    const userId = req.body.userId;
    const user = userModel.findOne({_id : userId});
    const data = courseModel.find({_id : user.courses});
    res.json({
        course : data
    });
    return ;

})


module.exports = {
    userRouter: userRouter
}