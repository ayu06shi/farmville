const express = require('express');
const router = express.Router();

// importing controllers
const {
    addProdController,
    updateProdController,
    deleteProdController,
    getProdController, 
    getMyProdController} = require('../controllers/ProdController');
const { auth, isFarmer } = require('../middlewares/auth');

// add product controller
router.post('/addProd', auth, isFarmer, addProdController);

// get products controller
router.get('/getProd', getProdController);

// get my products controller
router.get('/getMyProd', auth, isFarmer, getMyProdController);

// update product controller
router.put('/updateProd', auth, isFarmer, updateProdController);

// delete product controller
router.post('/deleteProd', auth, isFarmer, deleteProdController);

module.exports = router;