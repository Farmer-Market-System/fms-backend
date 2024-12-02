const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Buyer = require('../models/Buyer');
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

async function addBuyer() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        const user = new User({
            username: 'buyer1',
            email: 'buyer1@mailslurp.net',
            password: hashedPassword,
            role: 'buyer',
            status: 'active',
        });


        const savedUser = await user.save();

        const buyer = new Buyer({
            userId: savedUser._id, personalDetails: {
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '1234567890',
                address: '123 Buyer St, Sample City',
            },
            deliveryPreferences: {
                preferredDeliveryTime: '10:00 AM - 12:00 PM',
                deliveryAddress: '123 Buyer St, Sample City',
            },
        });

        await buyer.save();

        console.log('Buyer and user created successfully');
    } catch (err) {
        console.error('Error creating buyer and user:', err);
    } finally {
        mongoose.disconnect();
    }
}

addBuyer();
