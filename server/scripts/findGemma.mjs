import dotenv from 'dotenv';
dotenv.config();

async function listGemmaModels() {
    const key = process.env.GEMINI_API_KEY;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const d = await r.json();
    if (d.error) { console.log('Error:', d.error.message); return; }

    // Specifically search for gemma models
    const gemmaModels = d.models
        ?.filter(m => m.name.toLowerCase().includes('gemma'))
        .map(m => ({
            name: m.name,
            displayName: m.displayName,
            description: m.description
        }));

    console.log('Gemma Models Found:');
    console.log(JSON.stringify(gemmaModels, null, 2));

    // Also list all to be sure if none found
    if (!gemmaModels || gemmaModels.length === 0) {
        console.log('No Gemma models found. Listing first 10 models:');
        console.log(d.models?.slice(0, 10).map(m => m.name));
    }
}
listGemmaModels().catch(e => console.error(e.message));
