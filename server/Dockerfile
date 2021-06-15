FROM node:16.3.0-alpine

WORKDIR /usr/src/app

RUN mkdir -p ./movies/
RUN mkdir -p ./public/images

COPY *.json ./
COPY src ./src/

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
