FROM apify/actor-node-chrome:latest

WORKDIR /usr/src/app
USER root

COPY package.json package-lock.json ./
RUN chown -R node:node /usr/src/app && chmod -R 777 /usr/src/app
RUN npm install --only=prod --unsafe-perm=true

COPY . .

USER node

CMD ["node", "scrape.js"]
