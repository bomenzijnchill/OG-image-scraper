const { Actor } = require('apify');
const puppeteer = require('puppeteer-core');
require('dotenv').config();

Actor.main(async () => {
    const input = await Actor.getInput();
    if (!input || !input.urls) {
        console.log('Geen "urls" in input gevonden!');
        return;
    }

    // Start Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        // Loop door alle URLs
        for (const url of input.urls) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            const ogImage = await page.evaluate(() => {
                const ogMeta = document.querySelector('meta[property="og:image"]');
                return ogMeta ? ogMeta.content : 'Geen OG:image gevonden';
            });

            // In plaats van console.log, data opslaan in Dataset
            await Actor.pushData({
                url,
                ogImage
            });

            await page.close();
        }
    } finally {
        await browser.close();
    }
});
