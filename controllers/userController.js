const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');

exports.getProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const profile = await User.findById(userId);
        if (profile.role === 'farmer') {
            const farmer = await Farmer.findOne({userId: userId});
            return res.status(200).json(farmer)
        }else if (profile.role === 'buyer') {
            const buyer = await Buyer.findOne({userId: userId});
            return res.status(200).json(buyer)
        }
        return res.status(200).json(profile);
    } catch (err) {
        console.error('gettingProfile: ' + err.message);
        res.status(500).send('Error getting profile');
    }
};

