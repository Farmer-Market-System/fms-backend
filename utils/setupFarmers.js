const mongoose = require('mongoose');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

(async () => {
    try {
        const users = await User.find({
            email: { $in: ['farmer1@mailslurp.net', 'farmer2@mailslurp.net', 'farmer3@mailslurp.net'] }
        });

        const farmers = [
            {
                userId: users.find(user => user.email === 'farmer1@mailslurp.net')._id,
                personalDetails: {
                    firstName: 'John',
                    lastName: 'Doe',
                    phoneNumber: '1234567890',
                    address: '123 Farm Lane',
                    email: 'farmer1@mailslurp.net'
                },
                farmDetails: {
                    farmName: 'Green Acres',
                    farmSize: 50,
                    location: 'Ruralville'
                },
                approvalStatus: 'pending',
                rejectionReason: '',
                createdAt: new Date('2023-10-25T10:00:00Z'),
                updatedAt: new Date('2023-10-25T10:00:00Z')
            },
            {
                userId: users.find(user => user.email === 'farmer2@mailslurp.net')._id,
                personalDetails: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    phoneNumber: '0987654321',
                    address: '456 Country Road',
                    email: 'farmer2@mailslurp.net',
                },
                farmDetails: {
                    farmName: 'Sunny Meadows',
                    farmSize: 30,
                    location: 'Countryside'
                },
                approvalStatus: 'pending',
                rejectionReason: '',
                createdAt: new Date('2023-10-25T10:00:00Z'),
                updatedAt: new Date('2023-10-25T10:00:00Z')
            },
            {
                userId: users.find(user => user.email === 'farmer3@mailslurp.net')._id,
                personalDetails: {
                    firstName: 'Michael',
                    lastName: 'Johnson',
                    phoneNumber: '5551234567',
                    address: '789 Valley Drive',
                    email: 'farmer3@mailslurp.net'
                },
                farmDetails: {
                    farmName: 'Happy Valley Farms',
                    farmSize: 40,
                    location: 'Valleytown'
                },
                approvalStatus: 'pending',
                rejectionReason: '',
                createdAt: new Date('2023-10-25T10:00:00Z'),
                updatedAt: new Date('2023-10-25T10:00:00Z')
            }
        ];

        await Farmer.insertMany(farmers);
        console.log('Farmers inserted successfully');
    } catch (err) {
        console.error('Error inserting farmers:', err);
    } finally {
        mongoose.connection.close();
    }
})();
