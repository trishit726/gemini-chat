import * as ai from 'ai';

console.log("--- AI Exports ---");
Object.keys(ai).sort().forEach(k => {
    if (k.toLowerCase().includes('stream') || k.toLowerCase().includes('data')) {
        console.log(k);
    }
});
