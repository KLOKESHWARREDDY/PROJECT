console.log('Testing endpoint...');

fetch('http://localhost:5000/api/uploads/upload-profile-image', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(res => {
        console.log('STATUS:', res.status);
        return res.json().catch(() => res.text());
    })
    .then(data => {
        console.log('BODY:', data);
    })
    .catch(err => {
        console.error('ERROR:', err.message);
    });
