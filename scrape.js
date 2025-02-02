import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const scrapeOGImage = async (url) => {
    const browser = await puppeteer.launch({ headless: "new" });
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
