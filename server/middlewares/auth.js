const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// auth
exports.auth = async(req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "");

        // if token is missing, return response
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decode);
            req.user  = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid: Unauthorized Access",
            });
        }

        next(); // to go to the next middleware

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong during token validation",
        })
    }
};

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.role != "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only!",
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User's role cannot be verified!",
        })
    }
}

// isFarmer
exports.isFarmer = async(req, res, next) => {
    try {
        if(req.user.role != "Farmer") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Farmers only!",
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User's role cannot be verified!",
        })
    }
}

// isConsumer
exports.isConsumer = async(req, res, next) => {
    try {
        if(req.user.role != "Consumer") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Consumer only!",
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User's role cannot be verified!",
        })
    }
}


// flow:
// First, the auth middleware verifies 
// if the user is authenticated by checking the provided token.
// If authenticated, it checks if the authenticated 
// user has the role of a consumer.
// If both checks pass, the orderController is 
// executed to handle the order placement logic.