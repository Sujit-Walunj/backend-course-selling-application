const express = require("express");
const {z} = require("zod");
const Router = express.Router;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {courseModel, adminModel} = require("../Database/dbSchema");
const { authAdmin } = require("../Middlewares/admin");
const JWT_SECRET = "Sujit1589";
const adminRouter = Router();

adminRouter.post("/sign-up" ,async function(req,res){
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
        
        // get email and password and other data. 
        const email     = req.body.email;
        const password  = req.body.password;
        const firstname = req.body.firstname
        const lastname  = req.body.lastname;
         
        // hash password
        const hashedPassword  = await bcrypt.hash(password,10);
        try {

            await adminModel.create({
                email       : email,
                password    : hashedPassword,
                firstname   : firstname,
                lastname    : lastname
            })

        }
        catch(e){
            console.log("Error in creating database entry for new admin");
            console.log(e);
            res.status(500).json({
                msg : "Internal Server Error"
            })
            return;
        }

        res.status(200).json({
            msg : "Your account(Admin) created successfully"
        })

})


adminRouter.post("/login" ,async function(req,res){
    
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

    // check if user exist
    const email = req.body.email;

    const user = await adminModel.findOne({email : email});

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
                role : "admin" },
                    JWT_SECRET
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

adminRouter.delete("/delete" ,async function(req,res){

})




module.exports = {
    adminRouter:adminRouter
}