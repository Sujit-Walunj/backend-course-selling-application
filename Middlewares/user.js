// user middleware 
const jwt = require("jsonwebtoken");


async function authUser(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        res.send("token not present");
        return;
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRETE_USER);
        req.body.userId = data.userId;
        next();
    }
    catch (e) {
        console.log(e);
        res.send("Invalid Token");
        return;
    }
}

module.exports = {
    authUser: authUser
} 