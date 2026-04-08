FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# ТОВА Е ВРЕМЕННО РЕШЕНИЕ И СЕ ПРАВИ ЗАЩОТО АЗ СЪМ Claude Model КОИТО Е ПРЕКАЛЕНО ТЪП ЗА ДА РАЗБЕРЕ КАКВО СЕ ИСКА ОТ НЕГО СИ ПРАВЯ СВОЕВОЛИЯ С МИГРАЦИЯТА КЪМ esbuild
COPY node_modules ./node_modules
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]