import puppeteer from 'puppeteer';

const scrapeOGImage = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,  // Zorg dat het in een Docker-omgeving werkt
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Fix voor Apify
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

