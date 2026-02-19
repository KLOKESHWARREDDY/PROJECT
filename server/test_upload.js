
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const uploadImage = async () => {
    try {
        const form = new FormData();
        // Create a dummy file if it doesn't exist
        if (!fs.existsSync('test_image.jpg')) {
            fs.writeFileSync('test_image.jpg', 'fake image content');
        }

        form.append('profileImage', fs.createReadStream('test_image.jpg'));

        console.log('Attempting upload to http://localhost:5000/api/uploads/upload-profile-image');

        const response = await axios.post('http://localhost:5000/api/uploads/upload-profile-image', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': 'Bearer test-token' // This will fail auth, but should hit the route
            },
            validateStatus: () => true // Don't throw on 401/404
        });

        console.log('Status:', response.status);
        console.log('Data:', response.data);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
};

uploadImage();
