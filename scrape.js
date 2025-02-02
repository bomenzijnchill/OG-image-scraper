import puppeteer from 'puppeteer';

const scrapeOGImage = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: puppeteer.executablePath(), // Zorgt ervoor dat de juiste Chrome wordt gebruikt
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

const url = process.argv[2] || 'https://example.com';
scrapeOGImage(url);
