const express = require('express');
const { getAllProducts, getProductDetails, searchProducts, filterProducts } = require('../controllers/buyerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:productId', getProductDetails);
router.get('/search', searchProducts);
router.get('/filter', filterProducts);

module.exports = router;
