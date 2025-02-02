FROM apify/actor-node-puppeteer:latest

# Zet de werkdirectory
WORKDIR /usr/src/app

# Stel de juiste gebruiker in (Apify runt als "node")
USER root

# Kopieer package.json en package-lock.json eerst (sneller bouwen)
COPY package.json package-lock.json ./

# Zorg dat de juiste gebruiker rechten heeft
RUN chown -R node:node /usr/src/app && chmod -R 777 /usr/src/app

# Installeer afhankelijkheden met de juiste gebruiker
RUN npm install --only=prod --unsafe-perm=true

# Kopieer de rest van de bestanden
COPY . .

# Zet de juiste gebruiker terug naar "node"
USER node

# Forceer Node.js om ES-modules correct te laden
CMD ["node", "--experimental-modules", "scrape.js"]
