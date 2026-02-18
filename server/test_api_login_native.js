
const testLogin = async () => {
    try {
        console.log("Attempting login via native fetch...");

        // This requires Node 18+
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'lokesh1.kk2007@gmail.com',
                password: '123456'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Fetch Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
};

testLogin();
