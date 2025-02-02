FROM node:16

# 1. Installeer Chrome
RUN apt-get update && apt-get install -y wget gnupg
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y google-chrome-stable

# 2. Werkdirectory
WORKDIR /usr/src/app

# 3. Kopieer package.json en installeer
COPY package*.json ./
RUN npm install --only=prod

# 4. Kopieer je code (scrape.js etc.)
COPY . .

# 5. Start het script
CMD ["node", "scrape.js"]
