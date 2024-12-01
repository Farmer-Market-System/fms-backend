const express = require('express');
const { addProduct, uploadImages, getProducts, updateProduct, deleteProduct, getLowStockProducts } = require('../controllers/farmerController');
const authMiddleware = require('../middleware/authMiddleware');
const {authenticate} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/products', authenticate, authMiddleware.isFarmer, uploadImages, addProduct);
router.get('/products',authenticate, authMiddleware.isFarmer, getProducts);
router.put('/products/:productId', authenticate, authMiddleware.isFarmer, updateProduct);
router.delete('/products/:productId', authenticate, authMiddleware.isFarmer, deleteProduct);
router.get('/low-stock/:farmerId', authenticate, authMiddleware.isFarmer, getLowStockProducts);

module.exports = router;
