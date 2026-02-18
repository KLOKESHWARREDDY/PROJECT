
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'lokesh1.kk2007@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:', {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hasPassword: !!user.password
            });
        } else {
            console.log('User NOT found');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUser();
