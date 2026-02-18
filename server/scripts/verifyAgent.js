
const dotenv = require('dotenv');
dotenv.config();

async function testAgent() {
    console.log('--- Testing Agent Logic ---');
    const tokenRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'principal@bmsit.in', password: 'admin123' })
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    if (!token) {
        console.error('Login failed:', tokenData);
        return;
    }
    console.log('✅ Login successful');

    console.log('--- Initializing Agent ---');
    const initRes = await fetch('http://localhost:5000/api/agent/init', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ goal: 'Suggest 3 project ideas for web development' })
    });
    console.log('Init status:', initRes.status);

    console.log('--- Planning ---');
    const planRes = await fetch('http://localhost:5000/api/agent/plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const planData = await planRes.json();
    console.log('Plan status:', planRes.status);
    console.log('Plan:', JSON.stringify(planData, null, 2));

    if (planRes.ok) {
        console.log('--- Executing ---');
        const execRes = await fetch('http://localhost:5000/api/agent/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const execData = await execRes.json();
        console.log('Execute status:', execRes.status);
        console.log('Results:', JSON.stringify(execData, null, 2));
    }
}

testAgent().catch(console.error);
