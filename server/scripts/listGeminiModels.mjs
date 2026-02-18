import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const d = await r.json();
    if (d.error) { console.log('Error:', d.error.message); return; }
    const models = d.models?.filter(m => m.name.includes('gemini')).map(m => m.name);
    console.log('Available Gemini models:', models);

    // Test with gemini-pro
    const r2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hello in JSON: {"message": "hello"}' }] }] })
    });
    console.log('gemini-pro status:', r2.status);
    const d2 = await r2.json();
    console.log('gemini-pro response:', JSON.stringify(d2).substring(0, 200));
}
listModels().catch(e => console.error(e.message));
