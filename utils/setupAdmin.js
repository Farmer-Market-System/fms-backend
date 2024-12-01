const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createPredefinedAdmin = async () => {
    const adminEmail = 'admin-fms@mailslurp.net';
    const adminPassword = 'admin123'; // You should use a more secure method to store this
    const adminRole = 'admin';

    try {
        const existingAdmin = await User.findOne({ email: adminEmail, role: adminRole });
        if (existingAdmin) {
            console.log('Predefined admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new User({
            username: 'admin',
            email: adminEmail,
            password: hashedPassword,
            role: adminRole,
            status: 'active',
        });

        await newAdmin.save();
        console.log('Predefined admin created successfully');
    } catch (err) {
        console.error('Error creating predefined admin:', err);
    }
};

module.exports = createPredefinedAdmin;