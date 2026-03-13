import { streamText } from 'ai';

const model = {
    specificationVersion: 'v1',
    provider: 'test',
    modelId: 'test',
    doStream: async () => ({
        stream: new ReadableStream({
            start(controller) {
                controller.enqueue({ type: 'text-delta', textDelta: 'test' });
                controller.close();
            }
        }),
        rawCall: { rawPrompt: 'test', rawSettings: {} }
    })
};

try {
    const result = await streamText({
        model,
        prompt: 'test',
    });

    console.log('--- Result keys ---');
    console.log(Object.keys(result));

    console.log('\n--- Result prototype keys ---');
    let proto = Object.getPrototypeOf(result);
    while (proto && proto !== Object.prototype) {
        console.log(`\nPrototype: ${proto.constructor.name}`);
        Object.getOwnPropertyNames(proto).forEach(m => console.log('  ' + m));
        proto = Object.getPrototypeOf(proto);
    }

} catch (error) {
    console.error('Inspect failed:', error);
}
