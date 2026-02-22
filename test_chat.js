(async () => {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'teacher@gmail.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        const chatRes = await fetch('http://localhost:5000/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ message: 'hello bot' })
        });
        console.log('CHAT RESP STATUS:', chatRes.status);
        const chatData = await chatRes.json();
        console.log('CHAT RESP:', chatData);
    } catch (err) {
        console.log('ERROR:', err);
    }
})();
