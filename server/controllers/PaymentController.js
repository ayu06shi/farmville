const {instance} = require('../config/razorpay');
const Order = require('../models/Order')
const Product = require('../models/Product');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
// import all the frontend templates


// CAPTURE THE PAYMENT AND INITIATE THE ORDER
exports.capturePayment = async(req, res) => {
    // get prod id and user id
    const {prod_id} = req.body;
    const userId = req.body.id;

    // validation

    // valid prodID
    if(!prod_id) {
        return res.json({
            success: false,
            message: 'Please provide valid course ID',
        })
    }

    // valid prodDetail
    let prodDetail;
    try {
        prodDetail = await Product.findById(prod_id);
        if(!prodDetail) {
            return res.json({
                success: false,
                message: 'Could not find the course',
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
     
    // create order
    const amount = Order.totalPrice;
    const currency = 'INR';

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now().toString()),
        notes: {
            prodId: prod_id,
            userId,
        }
    };

    try {
        // initiating paymwnt using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // return response
        return res.status(200).json({
            success: true,
            products: products,
            amount: paymentResponse.amount,
            
        })

    } catch (error) {
        
    }

}