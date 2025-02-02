const { Actor } = require('apify');
const puppeteer = require('puppeteer-core');
require('dotenv').config();

Actor.main(async () => {
    // 1) Lees je input (bijv. { "urls": ["https://techcrunch.com"] })
    const input = await Actor.getInput();
    if (!input || !input.urls) {
        console.log('Geen "urls" in input gevonden!');
        return;
    }

    // 2) Start Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        // 3) Loop door alle URLs in input.urls
        for (const url of input.urls) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            // 4) Check meta[property="og:image"]
            const ogImage = await page.evaluate(() => {
                const ogMeta = document.querySelector('meta[property="og:image"]');
                return ogMeta ? ogMeta.content : 'Geen OG:image gevonden';
            });

            console.log(`OG:image voor ${url}:`, ogImage);
            await page.close();
        }
    } finally {
        await browser.close();
    }
});
