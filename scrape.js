// ----------------------------
// 1) In plaats van "import", gebruik "require"
const puppeteer = require('puppeteer-core');
require('dotenv').config(); // (alleen nodig als je .env-variabelen gebruikt)

// 2) Definieer je hoofd-functie voor scrapen
async function scrapeOGImage(url) {
    // 3) Start Puppeteer met een paar speciale instellingen
    //    Zodat hij de Chrome van Apify gebruikt en niet zelf downloadt
    const browser = await puppeteer.launch({
        headless: true,  // Draait onzichtbaar
        executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Oplossing voor Docker-permissies
    });

    const page = await browser.newPage();

    try {
        // 4) Ga naar de gewenste URL
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // 5) Zoek in de HTML-pagina naar de og:image-tag
        const ogImage = await page.evaluate(() => {
            // In oudere Node-versies kunnen we geen "?." gebruiken.
            // We doen het daarom "ouderwets":
            const ogMeta = document.querySelector('meta[property="og:image"]');
            return ogMeta ? ogMeta.content : 'Geen OG:image gevonden';
        });

        // 6) Print het resultaat in de terminal
        console.log(`OG:image voor ${url}:`, ogImage);
    } catch (error) {
        // 7) Als er iets misgaat, print een foutmelding
        console.error(`Fout bij scrapen van ${url}:`, error);
    } finally {
        // 8) Sluit de browser altijd netjes af
        await browser.close();
    }
}

// 9) Gebruik het eerste argument in de terminal als URL, anders "https://example.com"
const url = process.argv[2] || 'https://example.com';

// 10) Roep onze functie aan
scrapeOGImage(url);
