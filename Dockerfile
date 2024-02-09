FROM node:18-alpine AS build

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 3030
CMD [ "node", "index.js" ]