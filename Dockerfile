FROM node:alpine

WORKDIR /usr/src/app

COPY svelte.config.js ./
COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./static ./static

RUN npm run build

ENV HOST=0.0.0.0

CMD ["npm", "start"]
