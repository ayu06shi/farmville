const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

const orderController = async(req, res) => {
    try {
        const {
            farmerId,
            consumerId,
            products,
            totalPrice,
            deliveryAddress
        } = req.body;

         // Validate required fields
         if (!farmerId || !consumerId || !products || !totalPrice || !deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // validate products array
        if(!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Products array is required and should contain at least one product"
            })
        }

        // no need to calculate total price, since from frontend only,
        // we will send total by summing up all

        // creating a new order
        const newOrder = await Order.create({
            farmerId,
            consumerId,
            products,
            totalPrice,
            status: "Pending",
            deliveryAddress,
            createdAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        }) 
    }
}

const cancelOrder = async(req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id; // Assuming you have user info in req.user from auth middleware

        // finding order by id
        const order = await Order.findById(orderId);

        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // checking if the logged-in user is either the consumer or the farmer associated with the order
        if(order.consumerId.toString() !== userId.toString() && order.farmerId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "The logged in user is not authorized vto cancel the order"
            });
        }

        // update the order status to 'Canceled'
        order.status = 'Canceled';
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order canceled successfully",
            order,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        }) 
    }
}

const myOrders = async(req, res) => {
    try {
        const userId = req.user._id; 
        const userRole = req.user.role;

        let orders;

        if(userRole === 'Consumer') {
            orders = await Order.find({ consumerId: userId }).populate('products.productId');
        } else if(userRole === 'Farmer') {
            orders = await Order.find({ farmerId: userId }).populate('products.productId');
        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid user role",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            orders,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}

module.exports = { orderController, cancelOrder, myOrders };