const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const { MailSlurp } = require('mailslurp-client');
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP });

exports.getPendingFarmers = async (req, res) => {
    try {
        const pendingFarmers = await Farmer.find({ approvalStatus: 'pending' }).populate('userId', 'email');
        res.status(200).json({ message: 'Pending farmers fetched successfully', data: pendingFarmers });
    } catch (err) {
        console.error('getPendingFarmers: ' + err.message);
        res.status(500).json({ error: 'Error fetching pending farmers' });
    }
};

exports.approveFarmer = async (req, res) => {
    const { farmerId } = req.params;
    try {
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        farmer.approvalStatus = 'approved';
        await farmer.save();

        const user = await User.findById(farmer.userId);
        user.status = 'active';
        await user.save();

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: [user.email],
            subject: 'Account Approved',
            body: 'Your farmer account has been approved. You can now start listing your products.',
        };

        await mailslurp.sendEmail(process.env.MAILSLURP_ID, mailOptions);

        res.status(200).json({ message: 'Farmer approved successfully' });
    } catch (err) {
        console.error('approveFarmer: ' + err.message);
        res.status(500).json({ error: 'Error approving farmer' });
    }
};

exports.rejectFarmer = async (req, res) => {
    const { farmerId } = req.params;
    const { reason } = req.body;
    try {
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        farmer.approvalStatus = 'rejected';
        farmer.rejectionReason = reason;
        await farmer.save();

        const user = await User.findById(farmer.userId);
        user.status = 'disabled';
        await user.save();

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: [user.email],
            subject: 'Account Rejected',
            text: `Your farmer account has been rejected. Reason: ${reason}`,
        };

        await mailslurp.sendEmail(process.env.MAILSLURP_ID, mailOptions);

        res.status(200).json({ message: 'Farmer rejected successfully' });
    } catch (err) {
        console.error('rejectFarmer: ' + err.message);
        res.status(500).json({ error: 'Error rejecting farmer' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'Users fetched successfully', data: users });
    } catch (err) {
        console.error('getAllUsers: ' + err.message);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.editUser = async (req, res) => {
    const { userId } = req.params;
    const { role, status, ...updateData } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (role) user.role = role;
        if (status) user.status = status;
        Object.assign(user, updateData);

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('editUser: ' + err.message);
        res.status(500).json({ error: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'farmer') {
            await Farmer.findOneAndDelete({ userId: userId });
        } else if (user.role === 'buyer') {
            await Buyer.findOneAndDelete({ userId: userId });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('deleteUser: ' + err.message);
        res.status(500).json({ error: 'Error deleting user' });
    }
};
