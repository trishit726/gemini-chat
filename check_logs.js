import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let logs = '';
    page.on('console', msg => {
        if (msg.type() === 'error')
            logs += `PAGE ERROR: ${msg.text()}\n`;
    });

    page.on('pageerror', error => {
        logs += `UNCAUGHT ERROR: ${error.message}\n`;
    });

    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);

    fs.writeFileSync('errors.txt', logs, 'utf8');
    await browser.close();
})();
