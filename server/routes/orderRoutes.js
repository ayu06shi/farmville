const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const { isConsumer, auth } = require('../middlewares/auth');

router.post('/order', auth, isConsumer, orderController);
router.post('/cancelOrder', auth, isConsumer, cancelOrderController);
router.get('/myOrders', auth, isConsumer, myOrdersController);

module.exports = router;

