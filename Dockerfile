FROM node:alpine

WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./public ./public

RUN npm run build

ENV HOST=0.0.0.0

CMD ["npm", "start"]
