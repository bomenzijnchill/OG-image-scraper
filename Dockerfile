FROM apify/actor-node-puppeteer:latest

# Zet de werkdirectory
WORKDIR /usr/src/app

# Kopieer alle bestanden naar de container
COPY . .

# Installeer afhankelijkheden
RUN npm install --only=prod

# Start het script
CMD ["node", "scrape.js"]


