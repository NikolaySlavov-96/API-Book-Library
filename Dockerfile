# Stage 1: Building the code
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Creating the executable
FROM node:18-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

RUN npm ci --only=production

COPY . .

EXPOSE 3030
CMD [ "node", "index.js" ]