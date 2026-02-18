
import fetch from 'node-fetch'; // Check if node-fetch is needed or if native fetch works
// If node-fetch isn't installed, we might need to use http/https module or try native fetch.
// Let's assume native fetch (Node 18+) or fallback to http.

const login = async () => {
    try {
        console.log("Attempting login...");
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'lokesh1.kk2007@gmail.com',
                password: '123456'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

login();
