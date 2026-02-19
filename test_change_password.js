import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

async function testChangePassword() {
    const testUser = {
        name: 'Test User',
        email: `testuser_${Date.now()}@gmail.com`,
        password: 'password123',
        role: 'student'
    };

    try {
        console.log('1. Registering user...');
        const regRes = await axios.post(`${API_URL}/register`, testUser);
        const token = regRes.data.token;
        console.log('✅ Registered:', regRes.data.email);

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Logged in');

        console.log('3. Changing password...');
        const newPassword = 'newpassword123';
        await axios.put(
            `${API_URL}/change-password`,
            {
                currentPassword: testUser.password,
                newPassword: newPassword
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log('✅ Password changed');

        console.log('4. Logging in with new password...');
        await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: newPassword
        });
        console.log('✅ Logged in with new password');

        console.log('🎉 SUCCESS: Change password flow works correctly on backend.');

    } catch (error) {
        console.error('❌ FAILURE:', error.response?.data || error.message);
    }
}

testChangePassword();
