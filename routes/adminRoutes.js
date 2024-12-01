const express = require('express');
const {
    getPendingFarmers,
    approveFarmer,
    rejectFarmer,
    getAllUsers,
    editUser,
    deleteUser
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/pending-farmers', authMiddleware.authenticate, authMiddleware.isAdmin, getPendingFarmers);
router.post('/approve-farmer/:farmerId', authMiddleware.authenticate, authMiddleware.isAdmin, approveFarmer);
router.post('/reject-farmer/:farmerId', authMiddleware.authenticate, authMiddleware.isAdmin, rejectFarmer);
router.get('/users', authMiddleware.authenticate, authMiddleware.isAdmin, getAllUsers);
router.put('/users/:userId', authMiddleware.authenticate, authMiddleware.isAdmin, editUser);
router.delete('/users/:userId', authMiddleware.authenticate, authMiddleware.isAdmin, deleteUser);

module.exports = router;
