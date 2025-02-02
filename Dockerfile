FROM apify/actor-node-puppeteer:16

# 1) Werkmap instellen
WORKDIR /usr/src/app

# 2) Tijdelijk naar root-gebruiker zodat we permissies goedzetten
USER root

# 3) Eerst alleen package.json en package-lock.json kopiëren
COPY package.json package-lock.json ./

# 4) Zorg dat de map beschrijfbaar is
RUN chown -R node:node /usr/src/app && chmod -R 777 /usr/src/app

# 5) Installeer dependencies
RUN npm install --only=prod --unsafe-perm=true

# 6) Kopieer de rest van de bestanden
COPY . .

# 7) Zet gebruiker terug naar node (veiliger)
USER node

# 8) Start ons script (CommonJS-stijl, zonder extra flags)
CMD ["node", "scrape.js"]
