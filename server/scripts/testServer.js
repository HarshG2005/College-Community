async function testConnection() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/me');
        console.log('Server status:', response.status);
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
}

testConnection();
