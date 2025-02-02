const Apify = require('apify');          // <--- Apify SDK import
const puppeteer = require('puppeteer-core');
require('dotenv').config(); // Alleen nodig als je .env-variabelen hebt

Apify.main(async () => {
    // 1) Lees de Input van Apify
    //    Als iemand in Apify bij het tabblad 'Input' dit invult:
    //    { "urls": ["https://techcrunch.com", "https://example.com"] }
    //    dan komt dat hier binnen als een JavaScript-object.
    const input = await Apify.getInput();

    if (!input || !input.urls) {
        console.log('Geen "urls" in input, dus we stoppen.');
        return;
    }

    // 2) Start Puppeteer (met Chrome van onze Docker, geen extra download)
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        // 3) Loop door elke URL in input.urls
        for (const url of input.urls) {
            const page = await browser.newPage();

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' });

                // 4) Check de og:image-tag
                const ogImage = await page.evaluate(() => {
                    const ogMeta = document.querySelector('meta[property="og:image"]');
                    return ogMeta ? ogMeta.content : 'Geen OG:image gevonden';
                });

                // 5) Print in de logs (zie je bij 'Runs' > 'Dataset' of 'log')
                console.log(`OG:image voor ${url}:`, ogImage);
            } catch (error) {
                console.error(`Fout bij scrapen van ${url}:`, error);
            } finally {
                await page.close();
            }
        }
    } finally {
        // 6) Browser sluiten
        await browser.close();
    }
});
