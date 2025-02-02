FROM apify/actor-node-puppeteer:latest

# Zet de werkdirectory
WORKDIR /usr/src/app

# Kopieer package.json en package-lock.json eerst (sneller bouwen)
COPY package.json package-lock.json ./

# Zorg dat de juiste gebruiker rechten heeft
RUN npm install --only=prod --unsafe-perm=true

# Kopieer de rest van de bestanden
COPY . .

# Start het script
CMD ["node", "scrape.js"]
