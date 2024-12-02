const express = require('express');
const { getAllProducts, getProductDetails, searchProducts, filterProducts, createOrder } = require('../controllers/buyerController');
const authMiddleware = require('../middleware/authMiddleware');
const {authenticate} = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/products', authenticate,  authMiddleware.isBuyer, getAllProducts);
router.post('/orders', authenticate,  authMiddleware.isBuyer, createOrder);
router.get('/products/:productId', getProductDetails);
router.get('/search', searchProducts);
router.get('/filter', filterProducts);

module.exports = router;
