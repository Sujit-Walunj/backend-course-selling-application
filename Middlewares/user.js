// user middleware 
const jwt = require("jsonwebtoken");

const JWT_SECRETE = "Sujit1589"
async function authUser (req,res,next){

    const token = req.headers.token;
    if(!token){
        res.send("Invalid token / token not present");
        return;
    }

    try {    

        const data = jwt.verify(token,JWT_SECRETE);
        
        const userId = data.userId;
        const role = data.role;
        console.log(data);
        if(role != 'user'){
            res.json("Sorry you are not authorized");
            return;
        }
        req.body.userId  = userId;
        next();
        } 
catch(e){
    console.log(e);
        res.send("Invalid Token");
        return;
}
}

module.exports = {
    authUser : authUser
}