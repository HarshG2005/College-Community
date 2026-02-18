
import fetch from 'node-fetch';

async function listOpenRouterModels() {
    try {
        const r = await fetch('https://openrouter.ai/api/v1/models');
        const d = await r.json();
        const models = d.data
            ?.filter(m => m.id.toLowerCase().includes('gemma-3'))
            .map(m => m.id);
        console.log('Available Gemma 3 models:', models);
    } catch (e) {
        console.error('Error fetching models:', e.message);
    }
}

listOpenRouterModels();
