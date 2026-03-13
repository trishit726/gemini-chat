import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', error => console.log(`[UNCAUGHT] ${error.message}`));

    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Check textarea exists, type into it
    const textarea = page.locator('.input-textarea');
    const exists = await textarea.count();
    console.log(`Textarea found: ${exists > 0}`);

    if (exists > 0) {
        await textarea.click();
        await textarea.type('Hello test', { delay: 50 });
        const val = await textarea.inputValue();
        console.log(`Textarea value after typing: "${val}"`);

        // Check send button state
        const btn = page.locator('.send-button');
        const disabled = await btn.isDisabled();
        console.log(`Send button disabled: ${disabled}`);

        if (!disabled) {
            await btn.click();
            console.log('Clicked send!');
            await page.waitForTimeout(5000);

            // Check if any messages appeared
            const msgs = await page.locator('.message-wrapper').count();
            console.log(`Message count after send: ${msgs}`);

            // Check for error bubbles
            const errors = await page.locator('.error-bubble').count();
            console.log(`Error bubbles: ${errors}`);
            if (errors > 0) {
                const errText = await page.locator('.error-bubble').first().textContent();
                console.log(`Error text: ${errText}`);
            }

            // Get any assistant messages
            const assistantMsgs = await page.locator('.message-wrapper.assistant .message-bubble').count();
            console.log(`Assistant messages: ${assistantMsgs}`);
            if (assistantMsgs > 0) {
                const text = await page.locator('.message-wrapper.assistant .message-bubble').first().textContent();
                console.log(`First assistant reply: "${text.substring(0, 100)}"`);
            }
        }
    }

    await browser.close();
})();
