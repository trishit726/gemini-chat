import fetch from 'node-fetch';

async function testServer() {
    const url = 'http://localhost:3001/api/chat';
    const body = {
        messages: [{ role: 'user', content: 'Say hello' }],
        modelType: 'gemini'
    };

    try {
        console.log('--- Sending request to', url, '---');
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log('Status:', response.status);
        console.log('Headers:', response.headers.raw());

        if (!response.ok) {
            console.error('Error response:', await response.text());
            return;
        }

        const reader = response.body;
        console.log('\n--- Reading stream ---');
        reader.on('data', chunk => {
            console.log('CHUNK:', chunk.toString());
        });

        reader.on('end', () => console.log('\n--- Stream finished ---'));
        reader.on('error', err => console.error('Stream error:', err));

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testServer();
