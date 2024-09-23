FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:old

EXPOSE 8080

CMD [ "npm", "run", "start:old" ]