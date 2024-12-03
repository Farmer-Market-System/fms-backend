const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {authenticate} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/orders', authenticate, authMiddleware.isFarmer, getOrders);


module.exports = router;
