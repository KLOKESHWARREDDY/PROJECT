
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetPass = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'lokesh1.kk2007@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('123456', salt);
            await user.save();
            console.log('Password reset to 123456');
        } else {
            console.log('User NOT found');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

resetPass();
