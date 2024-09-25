const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const signupController = async(req, res) => {
    try {
        // fetch data from req body
        const {
            name,
            email,
            password,
            location,
            phone,
            description,
            role,
        } = req.body;

        if(!name || !email || !password || !location || !phone || !description || !role){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        // creating entry in database

        const user = await User.create({
            name, 
            email,
            password: hashedPwd,
            location,
            phone,
            description,
            role,
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again!"
        })
    }
};

const loginController = async(req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first!",
            });
        }

        // generate jwt, then match password
        if(await bcrypt.compare(password, user.password)){

            const payload = {
                email: user.email,
                id: user._id, // this payload contains user._id
                role: user.role,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })


            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*100),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully!"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error logging in",
        })
    }
}

const logoutController = async(req, res) => {
    try {
        // Clear the token from the cookie
        res.clearCookie("token", {
            expires: new Date(Date.now()), // Set cookie to expire immediately
            httpOnly: true, // Ensure cookie is not accessible via JavaScript
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error logging out",
        })
    }
}

module.exports = { signupController, loginController, logoutController };