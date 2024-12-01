const express = require('express');
const { registerFarmer, registerBuyer, login, adminLogin, passwordRecovery, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register/farmer', registerFarmer);
router.post('/register/buyer', registerBuyer);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/password-recovery', passwordRecovery);
router.post('/reset-password', resetPassword);
module.exports = router;
