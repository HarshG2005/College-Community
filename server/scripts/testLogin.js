async function testLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'principal@bmsit.in',
                password: 'admin123'
            })
        });
        console.log('Login Status:', response.status);
        const data = await response.json();
        if (response.ok) {
            console.log('Login Success! User:', data.user.name);
        } else {
            console.log('Login Failed:', data.message);
        }
    } catch (error) {
        console.error('Test Error:', error.message);
    }
}

testLogin();
