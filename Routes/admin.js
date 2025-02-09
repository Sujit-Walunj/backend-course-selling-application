const express = require("express");
const { z } = require("zod");
const Router = express.Router;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { courseModel, adminModel } = require("../Database/dbSchema");
const { authAdmin } = require("../Middlewares/admin");
const adminRouter = Router();

adminRouter.post("/sign-up", async function (req, res) {

    const requiredData = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(10),
        firstname: z.string().min(3).max(15),
        lastname: z.string().min(3).max(15),
    })

    const data = requiredData.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({
            error: data.error
        });
        return;
    }

    const { email, password, firstname, lastname } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstname: firstname,
            lastname: lastname
        });
    } catch (e) {
        console.log("Error in creating database entry for new admin");
        console.log(e);
        res.status(500).json({
            msg: "Internal Server Error"
        })
        return;
    }

    res.status(200).json({
        msg: "Your account(Admin) created successfully"
    });
})


adminRouter.post("/login", async function (req, res) {

    const requiredData = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(10)
    });

    const data = requiredData.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({
            error: data.error
        });
        return;
    }

    const { email } = req.body;
    const user = await adminModel.findOne({ email: email });

    if (!user) {
        res.status(404).json({
            msg: "User not found"
        })
        return;
    }

    const { password } = req.body;
    const isUser = bcrypt.compare(password, user.password);

    if (isUser) {
        const token = jwt.sign({ userId: user._id, role: "admin" }, process.env.JWT_SECRETE_ADMIN);
        res.status(200).json({
            msg: "You are logged in successfully",
            token: token
        });
        return;
    }
    else {
        res.status(400).json({
            msg: "Password is incorrect"
        })
        return;
    }
})


adminRouter.post("/create",authAdmin, async function(req,res){

    const courseData = z.object({
        title : z.string().min(3).max(150),
        description : z.string().max(500),
        price : z.number().min(0),
        imageUrl : z.string(),
        creator : z.string()
    });

    const data  = courseData.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            msg:"Invalid data format",
            error: data.error
        })
        return;
    }
    const {title,description,price,imageUrl,creator} = req.body;

    try{
        await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creator
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            msg:"Internal Sever Error"
        })
        return;
    }
    res.status(200).json({
        msg:"Course Created Sucessfully"
    })

})

adminRouter.delete("/delete", authAdmin, async function (req, res) {

    const courseData = z.string();

    const data = courseData.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            msg:"Invalid course Id"
        })
        return;
    }
    
    try{
       await courseModel.findByIdAndDelete(req.body.courseId);
        res.status(200).json({
            msg:"Course Deleted Successfully"
        });
    }
    catch(e){
        console.log(e);
        res.status(500).send("Internal Server Error");
        return;
    }

})


module.exports = {
    adminRouter: adminRouter
}