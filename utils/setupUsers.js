const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const users = [
    {
        username: 'johndoe',
        email: 'farmer1@mailslurp.net',
        password: 'password123',
        role: 'farmer',
        status: 'pending',
    },
    {
        username: 'janesmith',
        email: 'farmer2@mailslurp.net',
        password: 'password123',
        role: 'farmer',
        status: 'pending',
    },
    {
        username: 'michaeljohnson',
        email: 'farmer3@mailslurp.net',
        password: 'password123',
        role: 'farmer',
        status: 'pending',
    }
];

(async () => {
    try {
        const saltRounds = 10;
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            user.password = hashedPassword;
        }

        await User.insertMany(users);
        console.log('Users inserted successfully with hashed passwords');
    } catch (err) {
        console.error('Error inserting users:', err);
    } finally {
        mongoose.connection.close();
    }
})();
