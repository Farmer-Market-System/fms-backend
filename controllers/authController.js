const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MailSlurp } = require('mailslurp-client');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const BASE_URL = process.env.BASE_URL;
console.log(process.env.MAILSLURP)
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP });

exports.registerFarmer = async (req, res) => {
    const { personalDetails, farmDetails, ...userData } = req.body;
    console.log(req.body)
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({ username: personalDetails.firstName, email: userData.email, password: hashedPassword, role: 'farmer', status: 'pending' });
        await newUser.save();

        const newFarmer = new Farmer({ userId: newUser._id, personalDetails, farmDetails });
        await newFarmer.save();

        return res.status(201).json({message: 'Farmer registered successfully and awaiting approval'});
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Error registering farmer');
    }
};

exports.registerBuyer = async (req, res) => {
    const { personalDetails, deliveryPreferences, ...userData } = req.body;
    console.log(userData)
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({ username: personalDetails.firstName, email: userData.email, password: hashedPassword, role: 'buyer' });
        await newUser.save();

        const newBuyer = new Buyer({ userId: newUser._id, personalDetails, deliveryPreferences });
        await newBuyer.save();

        res.status(201).json({message: 'Buyer registered successfully'});
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error registering buyer');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({ accessToken, role: user.role });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'admin' });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({ accessToken, role: user.role });
    } catch (err) {
        console.error('Admin login >>>' + err.message);
        res.status(500).send('Error logging in');
    }
};

exports.passwordRecovery = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `${BASE_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: [email],
            subject: 'Password Reset',
            body: `Click the following link to reset your password: <a href="${resetLink}">Recover</a>`,
            isHTML: true
        };

        await mailslurp.sendEmail(process.env.MAILSLURP_ID, mailOptions);
        res.status(200).send('Password recovery email sent');
    } catch (err) {
        console.error('Password recovery >>>' + err.message)
        res.status(500).send('Error sending password recovery email');
    }
};

exports.resetPassword = async (req, res) => {
    const { recoverToken, newPassword } = req.body;
    try {
        const decoded = jwt.verify(recoverToken, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password reset successfully');
    } catch (err) {
        console.error('Reset password' + err.message)
        res.status(500).send('Error resetting password');
    }
};
