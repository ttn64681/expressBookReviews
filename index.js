const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if session exists
    // assume authorization object added to session, containing:
    // accessToken,
    // username,
    // password,
    if (req.session.authorization) {
        // grab token
        let token = jwt.sign(req.session.authorization['accessToken'])
        // verify token
        jwt.verify(token, 'access', (err, payload) => {
            if (!err) {
                req.user = payload;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });

    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
