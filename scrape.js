import puppeteer from 'puppeteer-core';

const scrapeOGImage = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome', // Fix voor Apify
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Fix voor Docker/Apify
    });

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const ogImage = await page.evaluate(() => {
            return document.querySelector('meta[property="og:image"]')?.content || 'Geen OG:image gevonden';
        });

        console.log(`OG:image voor ${url}:`, ogImage);
    } catch (error) {
        console.error(`Fout bij scrapen van ${url}:`, error);
    } finally {
        await browser.close();
    }
};

// Gebruik eerste argument als URL, anders default naar example.com
const url = process.argv[2] || 'https://example.com';
scrapeOGImage(url);
