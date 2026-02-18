import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    // First login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'principal@bmsit.in', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login:', loginRes.status, token ? 'Got token' : 'NO TOKEN');
    if (!token) { console.log(loginData); return; }

    // Test init
    const initRes = await fetch('http://localhost:5000/api/agent/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ goal: 'Suggest 3 project ideas for web development' })
    });
    const initData = await initRes.json();
    console.log('Init:', initRes.status, JSON.stringify(initData).substring(0, 300));

    // Test plan
    const planRes = await fetch('http://localhost:5000/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });
    const planData = await planRes.json();
    console.log('Plan status:', planRes.status);
    console.log('Plan data:', JSON.stringify(planData).substring(0, 800));
}
test().catch(e => console.error('ERROR:', e.message, e.stack));
