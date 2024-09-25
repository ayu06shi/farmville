const Product = require('../models/Product');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

// add product controller
const addProdController = async(req, res) => {
    try {
        const {
            name, 
            description,
            price,
            stock,
        } = req.body;

        const img = req.files.prodImage;

        if(!name || !description || !price || !stock || !createdAt){
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory."
            })
        }

        // check for farmer
        const userId = req.user.id;

        const farmerDetails = await User.findById(userId);

        console.log("Farmer Details: ", farmerDetails);

        if(!farmerDetails) {
            return res.status(402).json({
                success: false,
                message: "Farmer details not found",
            })
        }

        // upload image to cloudinary
        const image = await uploadImageToCloudinary(img, process.env.FOLDER_NAME);

        const newProd = await Product.create({
            name,
            description,
            price,
            farmerId: farmerDetails._id,
            stock,
            image: img.secure_url,
        })

        // add the new product to the user schema of farmer
        await User.findByIdAndUpdate(
            {
                _id: farmerDetails._id
            },
            {
                $push: {
                    products: newProd._id
                }
            },
            {
                new: true
            }
        );

        // const payload = {
        //     prId: newProd._id, // storing id of newly added product to use elsewhere
        // }

        return res.status(200).json({
            success: true,
            message: "Product Added Successfully",
            newProd,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add product",
            error: error.message,
        })
    }
};

// get products controller : to list all products on the browsing page
const getProdController = async(req, res) => {
    try {
        const allProd = await Product.find({}, {
            name: true,
            description: true,
            price: true,
            farmer: true,
            stock: true,
            image: true,
        }).populate("farmer")
        .exec();

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data: allProd,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to list all products",
            error: error.message,
        }) 
    }
};

// get my products controller
const getMyProdController = async(req, res) => {
    try {
        const userId = req.user._id;
        const myProd = await Product.find({ user: userId });

        return res.status(200).json({
            myProd
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to list farmer's products",
            error: error.message,
        }) 
    }
}

// delete product controller
const deleteProdController = async(req, res) => {
    try {
        // get id
        const id = req.body;

        // validate id
        const prodDetails = await Product.findById(id);

        if(!prodDetails) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        // delete product
        await Product.findByIdAndDelete({
            _id: prodDetails._id,
        });

        // to remove product details from farmer schema

        // return response
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message,
        }) 
    }
}

// update product details controller
const updateProdController = async(req, res) => {
    try {
        // get data
        const { 
            id,
            name,
            description,
            price,
            stock
        } = req.body;

        const prodDetails = await Product.findById(id);

        if(!prodDetails) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // update the image if a new one is provided
        let updatedImage = prodDetails.image;

        if(req.files && req.files.prodImage) {
            const img = req.files.prodImage;
            const uploadedImage = await uploadImageToCloudinary(img, process.env.FOLDER_NAME);
            updatedImage = uploadedImage.secure_url;
        }

        // update product details
        const updatedProd = await Product.findByIdAndUpdate(
            id,
            {
                name: name || prodDetails.name,
                description: description || prodDetails.description,
                price: price || prodDetails.price,
                stock: stock || prodDetails.stock,
                image: updatedImage,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProd,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update product details",
            error: error.message,
        })
    }
}

module.exports = {addProdController, getProdController, getMyProdController, deleteProdController, updateProdController};