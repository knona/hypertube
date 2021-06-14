FROM node:16.3.0-buster

WORKDIR /usr/src/app

COPY *.json ./
COPY rollup.config.js server.js tailwind.config.js ./
COPY src ./src/
COPY public ./public/

RUN npm install

RUN npm run build

EXPOSE 5000

ENV HOST=0.0.0.0

CMD ["npm", "start"]