const jwt = require("jsonwebtoken");

async function authAdmin(req, res, next) {

    const token = req.headers.token;
    if (!token) {
        res.send("token not present");
        return;
    }


    try {
        const data = jwt.verify(token, process.env.JWT_SECRETE_ADMIN);
        req.body.userId = data.userId;;
        next();
    }
    catch (e) {
        res.send("Invalid Token");
        return;
    }
}

module.exports = {
    authAdmin: authAdmin
}